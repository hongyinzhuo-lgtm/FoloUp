import MiniLoader from "@/components/loaders/mini-loader/miniLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { InterviewerService } from "@/services/interviewers.service";
import { ResponseService } from "@/services/responses.service";
import axios from "axios";
import { ArrowUpRight, Copy, CopyCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string | null;
  interviewerId: bigint;
  id: string;
  url: string;
  readableSlug: string;
}

// 直接固定你的线上域名，最稳定最简单
const base_url = "https://zhuoin-interviewer.up.railway.app";

function InterviewCard({ name, interviewerId, id, url, readableSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        const interviewer = await InterviewerService.getInterviewer(interviewerId);
        setImg(interviewer.image);
      } catch (error) {
        console.error("Failed to fetch interviewer:", error);
      }
    };

    fetchInterviewer();
  }, [interviewerId]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responses = await ResponseService.getAllResponses(id);
        setResponseCount(responses.length);

        if (responses.length > 0) {
          setIsFetching(true);

          for (const response of responses) {
            if (!response.is_analysed) {
              try {
                const result = await axios.post("/api/get-call", {
                  id: response.call_id,
                });

                if (result.status !== 200) {
                  throw new Error(`HTTP error! status: ${result.status}`);
                }
              } catch (error) {
                console.error(
                  `Failed to call /api/get-call for response id ${response.call_id}:`,
                  error,
                );
              }
            }
          }

          setIsFetching(false);
        }
      } catch (error) {
        console.error("Failed to fetch responses:", error);
      }
    };

    fetchResponses();
  }, [id]);

  const copyToClipboard = () => {
    const link = readableSlug
      ? `${base_url}/call/${readableSlug}`
      : `${base_url}/call/${url}`;

    navigator.clipboard.writeText(link).then(
      () => {
        setCopied(true);
        toast.success("你的面试链接已复制到剪贴板。", {
          position: "bottom-right",
          duration: 3000,
        });

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.error("Failed to copy:", err?.message || err);
        toast.error("复制失败，请稍后重试。", {
          position: "bottom-right",
          duration: 3000,
        });
      },
    );
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const interviewUrl = readableSlug
      ? `${base_url}/call/${readableSlug}`
      : `${base_url}/call/${url}`;

    window.open(interviewUrl, "_blank");
  };

  return (
    <a
      href={`/interviews/${id}`}
      style={{
        pointerEvents: isFetching ? "none" : "auto",
        cursor: isFetching ? "default" : "pointer",
      }}
    >
      <Card className="relative p-0 mt-4 inline-block cursor-pointer h-60 w-56 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md">
        <CardContent className={`p-0 ${isFetching ? "opacity-60" : ""}`}>
          <div className="w-full h-40 overflow-hidden bg-indigo-600 flex items-center text-center">
            <CardTitle className="w-full mt-3 mx-2 text-white text-lg">
              {name}
              {isFetching && (
                <div className="z-100 mt-[-5px]">
                  <MiniLoader />
                </div>
              )}
            </CardTitle>
          </div>

          <div className="flex flex-row items-center mx-4">
            <div className="w-full overflow-hidden">
              <Image
                src={img}
                alt="面试官图片"
                width={70}
                height={70}
                className="object-cover object-center"
              />
            </div>

            <div className="text-black text-sm font-semibold mt-2 mr-2 whitespace-nowrap">
              回答数：
              <span className="font-normal">
                {responseCount?.toString() || 0}
              </span>
            </div>
          </div>

          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              className="text-xs text-indigo-600 px-1 h-6"
              variant="secondary"
              onClick={handleJumpToInterview}
            >
              <ArrowUpRight size={16} />
            </Button>

            <Button
              className={`text-xs text-indigo-600 px-1 h-6 ${
                copied ? "bg-indigo-300 text-white" : ""
              }`}
              variant="secondary"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                copyToClipboard();
              }}
            >
              {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default InterviewCard;
