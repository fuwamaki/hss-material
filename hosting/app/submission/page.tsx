"use client";
import { useEffect, useState } from "react";
import CommonNavBar from "component/CommonNavBar";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { FireStoreRepository } from "repository/FireStoreRepository";
import type { SubmissionOriginalPlayEntity } from "model/SubmissionOriginalPlayEntity";
import type { SubmissionOriginalSiteEntity } from "model/SubmissionOriginalSiteEntity";
import type { SubmissionQuizEntity } from "model/SubmissionQuizEntity";
import { Button, Spinner, Tab, Tabs } from "@heroui/react";
import { addToast } from "@heroui/toast";
import Link from "next/link";
import SubmissionOriginalPlayForm from "./SubmissionOriginalPlayForm";
import SubmissionOriginalSiteForm from "./SubmissionOriginalSiteForm";
import SubmissionQuizForm from "./SubmissionQuizForm";

const Page = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [latestPlay, setLatestPlay] = useState<SubmissionOriginalPlayEntity | null>(null);
  const [latestSite, setLatestSite] = useState<SubmissionOriginalSiteEntity | null>(null);
  const [latestQuiz, setLatestQuiz] = useState<SubmissionQuizEntity | null>(null);
  const isLoading = loading || submitting;

  const fetchLatest = async (studentId: string) => {
    setLoading(true);
    try {
      const [play, site, quiz] = await Promise.all([
        FireStoreRepository.getLatestSubmissionOriginalPlay(studentId),
        FireStoreRepository.getLatestSubmissionOriginalSite(studentId),
        FireStoreRepository.getLatestSubmissionQuiz(studentId),
      ]);
      setLatestPlay(play);
      setLatestSite(site);
      setLatestQuiz(quiz);
    } catch (e) {
      console.error(e);
      addToast({ title: "提出情報の取得に失敗しました。", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await FirebaseAuthRepository.initialize();
      if (FirebaseAuthRepository.uid) {
        setUid(FirebaseAuthRepository.uid);
        await fetchLatest(FirebaseAuthRepository.uid);
      } else {
        setUid(null);
      }
    })();
  }, []);

  const handleSubmitPlay = async (payload: { title: string; targetUser: string; userStory: string }) => {
    if (!uid) return;
    setSubmitting(true);
    try {
      if (latestPlay) {
        await FireStoreRepository.updateSubmissionOriginalPlay(latestPlay.id, payload);
      } else {
        await FireStoreRepository.addSubmissionOriginalPlay(uid, payload.title, payload.targetUser, payload.userStory);
      }
      addToast({ title: "提出しました。", color: "success" });
      await fetchLatest(uid);
    } catch (e) {
      addToast({ title: "提出に失敗しました。", color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSite = async (payload: { keyFeature: string; sourceCode: string }) => {
    if (!uid) return;
    setSubmitting(true);
    try {
      if (latestSite) {
        await FireStoreRepository.updateSubmissionOriginalSite(latestSite.id, payload);
      } else {
        await FireStoreRepository.addSubmissionOriginalSite(uid, payload.keyFeature, payload.sourceCode);
      }
      addToast({ title: "提出しました。", color: "success" });
      await fetchLatest(uid);
    } catch (e) {
      addToast({ title: "提出に失敗しました。", color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitQuiz = async (payload: { keyFeature: string; sourceCode: string }) => {
    if (!uid) return;
    setSubmitting(true);
    try {
      if (latestQuiz) {
        await FireStoreRepository.updateSubmissionQuiz(latestQuiz.id, payload);
      } else {
        await FireStoreRepository.addSubmissionQuiz(uid, payload.keyFeature, payload.sourceCode);
      }
      addToast({ title: "提出しました。", color: "success" });
      await fetchLatest(uid);
    } catch (e) {
      addToast({ title: "提出に失敗しました。", color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <Spinner
            color="primary"
            label=""
            size="lg"
          />
        </div>
      )}
      <CommonNavBar title="提出" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!uid ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
            <div className="text-lg font-bold text-neutral-800 mb-2">ログインが必要です</div>
            <div className="text-sm text-neutral-600 mb-4">提出するには、アカウントでログインしてください。</div>
            <Link href="/account">
              <Button color="primary">アカウントページへ</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <Tabs
              aria-label="提出タブ"
              color="primary"
              variant="underlined"
            >
              <Tab
                key="quiz"
                title="共通課題:クイズ"
              >
                <SubmissionQuizForm
                  initial={latestQuiz}
                  isSubmitting={submitting}
                  onSubmit={handleSubmitQuiz}
                />
              </Tab>
              <Tab
                key="play"
                title="オリジナルサイト企画"
              >
                <SubmissionOriginalPlayForm
                  initial={latestPlay}
                  isSubmitting={submitting}
                  onSubmit={handleSubmitPlay}
                />
              </Tab>
              <Tab
                key="site"
                title="オリジナルサイト"
              >
                <SubmissionOriginalSiteForm
                  initial={latestSite}
                  isSubmitting={submitting}
                  onSubmit={handleSubmitSite}
                />
              </Tab>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
