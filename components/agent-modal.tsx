"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Loader2, AlertCircle, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/lib/types";

interface AgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentModal({ agent, isOpen, onClose }: AgentModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!modalRef.current) return;

    try {
      if (!isFullscreen) {
        await modalRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  if (!agent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#0d1829] dark:via-[#1a2332] dark:to-[#0d1829] shadow-2xl w-full h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-orange-200/30 dark:border-orange-900/30 bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 dark:from-[#0d1829] dark:via-orange-950/20 dark:to-[#0d1829] backdrop-blur-xl relative overflow-hidden">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-orange-700 to-gray-900 dark:from-gray-100 dark:via-orange-400 dark:to-gray-100 bg-clip-text text-transparent">
                      {agent.name}
                    </h2>
                    <Badge variant="outline" className="text-xs bg-white/50 dark:bg-black/30 backdrop-blur-sm">
                      {agent.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4 relative z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="rounded-full hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-sm hover:scale-110 transition-all"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-sm hover:scale-110 transition-all"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 relative bg-gray-100 dark:bg-[#0d1829]">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#1a2332]">
                    <Loader2 className="h-12 w-12 animate-spin text-orange-600 dark:text-orange-400 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Loading agent interface...
                    </p>
                  </div>
                )}

                {hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#1a2332] p-8">
                    <AlertCircle className="h-16 w-16 text-orange-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Failed to Load Agent
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                      The agent interface could not be loaded. Please try again later.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                <iframe
                  src={agent.vercelUrl}
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                  title={agent.name}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
