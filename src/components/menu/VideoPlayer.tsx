"use client";

import React, { useState, useRef } from 'react';
import { Box, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import { PlayCircle, Pause, VolumeUp, VolumeOff, Fullscreen, Close, HighQuality } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  autoPlay?: boolean;
  showControlsProp?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  posterUrl,
  title,
  autoPlay = false,
  showControlsProp = true,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(showControlsProp);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenDialog, setShowFullscreenDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      setShowFullscreenDialog(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleCloseFullscreen = () => {
    setShowFullscreenDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 200,
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: showControls ? 'default' : 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onClick={handlePlayPause}
          playsInline
          muted={isMuted}
          loop
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                <PlayCircle sx={{ fontSize: 64 }} />
              </IconButton>
            </motion.div>
          </Box>
        )}

        {/* Controls */}
        <AnimatePresence>
          {showControls && isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '40px 16px 16px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handlePlayPause} sx={{ color: '#fff' }}>
                    {isPlaying ? <Pause /> : <PlayCircle />}
                  </IconButton>
                  <IconButton onClick={handleMuteUnmute} sx={{ color: '#fff' }}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handleFullscreen} sx={{ color: '#fff' }}>
                    <Fullscreen />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: 'rgba(0,0,0,0.6)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <HighQuality sx={{ fontSize: 16, color: '#FFD700' }} />
          <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600 }}>
            PREMIUM
          </Typography>
        </Box>

        {/* Title */}
        {title && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.6)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Fullscreen Dialog */}
      <Dialog
        open={showFullscreenDialog}
        onClose={handleCloseFullscreen}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            maxHeight: '100vh',
            height: '100%',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', height: '90vh' }}>
          <IconButton
            onClick={handleCloseFullscreen}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <Close />
          </IconButton>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
