"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import type { ReactNode } from "react";
import { Divider } from "@heroui/react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview = ({ content, className }: MarkdownPreviewProps) => {
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
        return <code className="rounded bg-indigo-800 px-2 py-1 text-white text-sm">{children}</code>;
      }
      return (
        <code
          className={`block rounded-xl bg-indigo-800 my-2 p-4 text-sm text-white whitespace-pre overflow-x-auto ${
            hasLangClass ? codeClassName : ""
          }`}
        >
          {children}
        </code>
      );
    },
    hr: () => <Divider className="my-6" />,
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks] as any[]}
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
