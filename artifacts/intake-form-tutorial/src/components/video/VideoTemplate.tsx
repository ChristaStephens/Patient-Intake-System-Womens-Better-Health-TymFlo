import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import { Scene8 } from './video_scenes/Scene8';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 5000,
  section1: 6000,
  section2: 6000,
  section3: 6000,
  section4: 6000,
  section5_6: 6000,
  section7: 6000,
  outro: 6000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  section1: Scene2,
  section2: Scene3,
  section3: Scene4,
  section4: Scene5,
  section5_6: Scene6,
  section7: Scene7,
  outro: Scene8,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="w-full h-screen overflow-hidden relative bg-[var(--color-bg-light)]">
      {/* Persistent Background Motion */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-20 blur-3xl mix-blend-multiply"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)' }}
          animate={{ x: ['-20%', '30%', '-10%'], y: ['-10%', '20%', '-20%'], scale: [1, 1.2, 0.9] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl right-0 bottom-0 mix-blend-multiply"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
          animate={{ x: ['10%', '-20%', '5%'], y: ['20%', '-30%', '10%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
