"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import type { ReactNode } from "react";
import { Divider } from "@heroui/react";
import { visit } from "unist-util-visit";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview = ({ content, className }: MarkdownPreviewProps) => {
  const remarkCustomContainer = () => (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective") return;
      const name = String(node.name || "").toLowerCase();
      if (!name) return;

      node.data = node.data || {};
      node.data.hName = "div";
      node.data.hProperties = {
        ...(node.data.hProperties || {}),
        "data-directive": name,
      };
    });
  };

  const urlTransform = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return url;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("blob:")) return url;
    return url;
  };

  const components = {
    h1: ({ children }: { children: ReactNode }) => (
      <h1 className="text-2xl font-bold text-neutral-900 mt-6 mb-3">{children}</h1>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <h2 className="text-xl font-bold text-neutral-900 mt-5 mb-3">{children}</h2>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <h3 className="text-lg font-bold text-neutral-900 mt-4 mb-2">{children}</h3>
    ),
    h4: ({ children }: { children: ReactNode }) => (
      <h4 className="text-base font-bold text-neutral-900 mt-4 mb-2">{children}</h4>
    ),
    p: ({ children }: { children: ReactNode }) => <p className="my-3 leading-relaxed text-neutral-700">{children}</p>,
    a: ({ href, children }: { href?: string; children: ReactNode }) => (
      <a
        href={href}
        className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    img: ({
      src = "",
      alt = "",
      width,
      height,
    }: {
      src?: string;
      alt?: string;
      width?: string | number;
      height?: string | number;
    }) => {
      const parsedWidth =
        width === undefined || width === null ? undefined : typeof width === "number" ? `${width}px` : String(width);
      const parsedHeight =
        height === undefined || height === null
          ? undefined
          : typeof height === "number"
            ? `${height}px`
            : String(height);
      const style: React.CSSProperties = {
        width: parsedWidth ?? "100%",
        maxWidth: "100%",
        height: parsedHeight ?? "auto",
      };
      return (
        <img
          src={src}
          alt={alt}
          className="my-4 rounded-xl object-contain block max-w-full"
          style={style}
          loading="lazy"
          decoding="async"
        />
      );
    },
    ul: ({ children }: { children: ReactNode }) => (
      <ul className="my-3 ml-5 list-disc space-y-1 text-neutral-700">{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className="my-3 ml-5 list-decimal space-y-1 text-neutral-700">{children}</ol>
    ),
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="my-4 border-l-4 border-indigo-200 bg-indigo-50/60 px-4 py-2 text-neutral-700">
        {children}
      </blockquote>
    ),
    code: (props: any) => {
      const { inline, children, className: codeClassName, node } = props;
      const hasLangClass = typeof codeClassName === "string" && /(language-|hljs)/.test(codeClassName);
      const hasPosition = Boolean(node?.children?.[0]?.position);
      const isInline = inline === true || hasPosition;

      if (isInline) {
        return <code className="rounded bg-indigo-900 px-2 py-1 text-white text-sm">{children}</code>;
      }
      return (
        <code
          className={`block rounded-xl bg-indigo-900 my-2 p-4 text-sm text-white whitespace-pre overflow-x-auto ${
            hasLangClass ? codeClassName : ""
          }`}
        >
          {children}
        </code>
      );
    },
    hr: () => <Divider className="my-6" />,
    div: ({ children, ...props }: any) => {
      const directive = props["data-directive"] as string | undefined;
      if (!directive) {
        return <div {...props}>{children}</div>;
      }

      const base = "my-4 rounded-xl border px-4 py-3 text-sm leading-relaxed shadow-sm";
      const variants: Record<string, string> = {
        note: "border-indigo-200 bg-indigo-100 text-indigo-900",
        info: "border-sky-200 bg-sky-100 text-sky-900",
        success: "border-emerald-200 bg-emerald-100 text-emerald-900",
        warning: "border-yellow-200 bg-yellow-100 text-yellow-900",
        danger: "border-rose-200 bg-rose-100 text-rose-900",
      };
      const variantClass = variants[directive] ?? "border-neutral-200 bg-neutral-50 text-neutral-800";

      return (
        <div
          {...props}
          className={`${base} ${variantClass}`}
        >
          {children}
        </div>
      );
    },
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkDirective, remarkCustomContainer] as any[]}
        rehypePlugins={[rehypeRaw, rehypeHighlight] as any[]}
        components={components}
        urlTransform={urlTransform}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
