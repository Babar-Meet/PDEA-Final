import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDownloads, fetchSettings } from '../../store/slices/downloadSlice';

/**
 * Polls download status when there are active downloads.
 * Fetches downloads and settings on mount.
 */
const DownloadPoller = () => {
  const dispatch = useDispatch();
  const downloads = useSelector((state) => state.download.downloads);
  const pollIntervalRef = useRef(null);

  const hasActive = downloads.some((d) =>
    ['downloading', 'starting', 'queued'].includes(d.status)
  );

  useEffect(() => {
    if (hasActive && !pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(() => {
        dispatch(fetchDownloads());
      }, 2000);
    } else if (!hasActive && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, [hasActive, dispatch]);

  useEffect(() => {
    dispatch(fetchDownloads());
    dispatch(fetchSettings());
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [dispatch]);

  return null;
};

export default DownloadPoller;
