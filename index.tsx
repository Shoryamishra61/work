import React, { useState, useRef, useEffect, useCallback } from 'react'; // Added useCallback
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
  Platform,
  Text, // Keep Text for modals, headers if any
  Image, // Added Image for creator avatar
  FlatList, // Added FlatList
  Dimensions, // Added Dimensions back
} from 'react-native';
import { router } from 'expo-router';
import { Video, ResizeMode, Audio, AVPlaybackStatusSuccess, AVPlaybackStatusError, AVPlaybackStatus } from 'expo-av';
import { Play, Pause, Brain, ChevronRight, Maximize, Heart, MessageCircle, Send, MoreVertical, Plus, Music2 } from 'lucide-react-native';

// Design System & Quiz (QuizScreen might be removed if not used in this specific new layout)
import theme from './styles/theme';
import StyledText from './components/StyledText'; // Import StyledText
// import QuizScreen from './quiz'; // QuizScreen will be re-added if a trigger mechanism is part of this new design

const { width, height } = Dimensions.get('window');

interface VideoContent {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  isPremium: boolean;
  // isLiked, isMuted, isPlaying will be handled by expo-av state
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; // Retain for potential filtering
  tags: string[];
  hasQuiz?: boolean;
  quizTimestamp?: number; // Seconds into video when quiz should trigger
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

const mockVideos: VideoContent[] = [
  {
    id: '1',
    title: 'React Hooks in 60 Seconds',
    description: 'Master useState and useEffect quickly! Essential React concepts every developer needs. #React #JavaScript #WebDev',
    category: 'Web Development',
    duration: '1:00',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: false,
    },
    likes: 8900,
    comments: 445,
    shares: 167,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: true,
    difficulty: 'Beginner',
    tags: ['react', 'hooks', 'javascript'],
    hasQuiz: true,
    quizTimestamp: 5, // Show quiz cue after 5 seconds for this video
  },
  {
    id: '2',
    title: 'Neural Networks Explained',
    description: 'Quick explanation of how neural networks process information and learn patterns. Perfect for beginners! #AI #MachineLearning',
    category: 'AI & ML',
    duration: '0:58',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    likes: 12400,
    comments: 892,
    shares: 234,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Beginner',
    tags: ['ai', 'neural-networks', 'machine-learning'],
    hasQuiz: true,
    quizTimestamp: 8,
  },
  {
    id: '3',
    title: 'Python Data Analysis',
    description: 'Learn Python for data analysis with pandas and matplotlib. Essential skills for data scientists! #Python #DataScience',
    category: 'Data Science',
    duration: '1:30',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'Maya Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    likes: 15600,
    comments: 1200,
    shares: 456,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Intermediate',
    tags: ['python', 'data-analysis', 'pandas'],
  },
  {
    id: '4',
    title: 'Advanced JavaScript ES6',
    description: 'Modern JavaScript features that every developer should know. Arrow functions, destructuring, and more! #JavaScript #ES6',
    category: 'Web Development',
    duration: '1:45',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'CodeMaster',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: false,
    },
    likes: 7800,
    comments: 324,
    shares: 189,
    isPremium: true,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Advanced',
    tags: ['javascript', 'es6', 'modern-js'],
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts and algorithms. Perfect starting point for AI enthusiasts! #MachineLearning #AI',
    category: 'AI & ML',
    duration: '2:15',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'AI Expert',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    likes: 9200,
    comments: 567,
    shares: 298,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Beginner',
    tags: ['machine-learning', 'ai', 'algorithms'],
  },
  {
    id: '6',
    title: 'CSS Grid Layout Mastery',
    description: 'Master CSS Grid with practical examples. Create responsive layouts like a pro! #CSS #WebDesign #Frontend',
    category: 'Web Development',
    duration: '1:20',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'DesignPro',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: false,
    },
    likes: 6500,
    comments: 234,
    shares: 145,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Intermediate',
    tags: ['css', 'grid', 'layout'],
  },
  {
    id: '7',
    title: 'Data Visualization with D3.js',
    description: 'Create stunning interactive data visualizations with D3.js. From basics to advanced techniques! #DataViz #D3js',
    category: 'Data Science',
    duration: '2:30',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'DataViz Master',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    likes: 11300,
    comments: 678,
    shares: 389,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Advanced',
    tags: ['d3js', 'data-visualization', 'javascript'],
  },
  {
    id: '8',
    title: 'Docker Containerization',
    description: 'Learn Docker basics and containerize your applications. DevOps made simple! #Docker #DevOps #Containers',
    category: 'DevOps',
    duration: '1:55',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'DevOps Guru',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: false,
    },
    likes: 8700,
    comments: 445,
    shares: 267,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Intermediate',
    tags: ['docker', 'devops', 'containers'],
  },
  {
    id: '9',
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns and best practices. Take your React skills to the next level! #React #Advanced',
    category: 'Web Development',
    duration: '2:45',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'React Expert',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    likes: 13500,
    comments: 789,
    shares: 456,
    isPremium: true,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Advanced',
    tags: ['react', 'advanced', 'patterns'],
  },
  {
    id: '10',
    title: 'Database Design Principles',
    description: 'Learn database design fundamentals and normalization. Build efficient and scalable databases! #Database #SQL',
    category: 'Backend',
    duration: '2:20',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'sample-video',
    creator: {
      name: 'DB Architect',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: false,
    },
    likes: 9800,
    comments: 523,
    shares: 312,
    isPremium: false,
    isLiked: false,
    isMuted: false,
    isPlaying: false,
    difficulty: 'Intermediate',
    tags: ['database', 'sql', 'design'],
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    user: 'TechLearner23',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'This is exactly what I needed! Clear and concise explanation 🔥',
    timestamp: '2h',
    likes: 24,
  },
  {
    id: '2',
    user: 'CodeNewbie',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Can you make a longer version of this? Would love to see more examples',
    timestamp: '4h',
    likes: 12,
  },
  {
    id: '3',
    user: 'DevMaster',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Great content! Following for more tutorials 👍',
    timestamp: '6h',
    likes: 8,
  },
];

export default function HomeScreen() {
  const [currentVideo, setCurrentVideo] = useState(0);
  // Most state related to old UI (comments, filters, specific video item states like isLiked) is removed.
  // Retain state for modals if they are to be used with the new player.
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  // const [showQuizOverlay, setShowQuizOverlay] = useState(false); // If quiz is triggered from new UI
  // const [activeQuizVideoTitle, setActiveQuizVideoTitle] = useState<string | undefined>(undefined);

  // Video Player State
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play initially
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatusSuccess | null>(null);
  const showPlayPauseIconAnim = useRef(new Animated.Value(0)).current; // Start hidden
  const playPauseFadeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Action Stack State
  const [isFollowing, setIsFollowing] = useState(false);
  // Initialize isLiked and likeCount from currentVideoData after it's defined
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // To track active video in FlatList

  // Animation Values
  const actionStackAnimX = useRef(new Animated.Value(50)).current; // Start off-screen (right)
  const actionStackOpacityAnim = useRef(new Animated.Value(0)).current;
  const infoBlockAnimY = useRef(new Animated.Value(50)).current; // Start off-screen (bottom)
  const infoBlockOpacityAnim = useRef(new Animated.Value(0)).current;


  // Use the first video for now, swiping will come later
  // const currentVideoData = mockVideos[0]; // Replaced by FlatList's current item
  // Ensure videoUrl is a valid streaming URL or local file URI
  // mockVideos.forEach(v => {
  //   if (v.videoUrl === 'sample-video') v.videoUrl = 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';
  // });

  // Ensure all videos have a valid URL for FlatList
  const videosWithValidUrls = mockVideos.map(v => ({
    ...v,
    videoUrl: v.videoUrl === 'sample-video' ? 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' : v.videoUrl,
    // Initialize isPlaying and isMuted for individual video items if needed by Video component's props directly
    // For now, global isPlaying controls the currently active video via ref.
  }));


  useEffect(() => {
    // Initialize like state from video data when component mounts or video changes
    const videoData = videosWithValidUrls[currentVideoIndex];
    if (videoData) {
        setIsLiked(videoData.isLiked || false);
        setLikeCount(videoData.likes || 0);
        setIsFollowing(false); // Reset following state per video
        setIsCaptionExpanded(false); // Reset caption state per video
    }
  }, [currentVideoIndex]);


  // Simulate checking if new onboarding is completed
  const checkIfNewOnboardingCompleted = () => {
    // In a real app, this would check AsyncStorage or similar
    console.log('Simulating check: New onboarding not completed.');
    return false;
  };

  useEffect(() => {
    // Configure audio mode
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true, // Important for videos to play with sound even if phone is on silent
      staysActiveInBackground: false,
      shouldDuckAndroid: false, // Do not reduce audio of other apps
    });

    // Logic for migration modal (can be kept or removed if not relevant to this blueprint)
    if (router.canGoBack() && router.getPathname() === '/onboarding') {
        return;
    }
    if (!checkIfNewOnboardingCompleted()) {
      setShowMigrationModal(true);
    }
  }, []);

  const handlePlayPausePress = async () => {
    if (!videoRef.current) return;

    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    if (newIsPlaying) {
      await videoRef.current.playAsync();
    } else {
      await videoRef.current.pauseAsync();
    }

    // Show and fade out icon
    Animated.timing(showPlayPauseIconAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    if (playPauseFadeTimeout.current) clearTimeout(playPauseFadeTimeout.current);
    playPauseFadeTimeout.current = setTimeout(() => {
      Animated.timing(showPlayPauseIconAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    }, 1000);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackStatus(status);
    } else if (status.isLoaded === false && (status as AVPlaybackStatusError).error) {
        console.error(`Video Error: ${(status as AVPlaybackStatusError).error}`);
        setPlaybackStatus(null); // Clear status on error
    }
  };

  const progress = playbackStatus?.durationMillis
    ? (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100
    : 0;

  const triggerOverlayAnimations = (isAppearing: boolean) => {
    const commonConfig = { duration: 200, useNativeDriver: true };
    Animated.parallel([
      Animated.timing(actionStackOpacityAnim, { toValue: isAppearing ? 1 : 0, ...commonConfig }),
      Animated.timing(actionStackAnimX, { toValue: isAppearing ? 0 : 50, ...commonConfig }),
      Animated.timing(infoBlockOpacityAnim, { toValue: isAppearing ? 1 : 0, ...commonConfig }),
      Animated.timing(infoBlockAnimY, { toValue: isAppearing ? 0 : 50, ...commonConfig }),
    ]).start();
  };

  useEffect(() => {
    // Reset and trigger animation when currentVideoIndex changes
    actionStackOpacityAnim.setValue(0);
    actionStackAnimX.setValue(50);
    infoBlockOpacityAnim.setValue(0);
    infoBlockAnimY.setValue(50);
    triggerOverlayAnimations(true);
  }, [currentVideoIndex]);


  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== null && newIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newIndex);
        //setIsPlaying(true); // Auto-play new video. Note: global isPlaying, videoRef needs to target new video.
      }
    }
  }, [currentVideoIndex]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Item is considered viewable when 50% visible
  };


  const renderVideoItem = ({ item, index }: { item: VideoContent, index: number }) => {
    const isActive = index === currentVideoIndex;
    // Each item needs its own videoRef if we want to control them independently from the parent.
    // For simplicity here, we're still using one main videoRef, which might be problematic for FlatList.
    // A better approach would be to pass a ref to each VideoItem component.
    // For now, only the active video will play based on global isPlaying state.

    // This component will represent a single video item in the FlatList
    // It will contain the Video player, info block, and action stack
    // The animation trigger will be based on currentVideoIndex changing in the parent (HomeScreen)

    const itemVideoRef = useRef<Video>(null); // Each item gets its own ref

    useEffect(() => { // Control playback for THIS video item
        if (itemVideoRef.current) {
            if (isActive && isPlaying) { // Global isPlaying for the active video
                itemVideoRef.current.playAsync();
            } else {
                itemVideoRef.current.pauseAsync();
            }
        }
    }, [isActive, isPlaying]);


    return (
      <View style={styles.videoPlayerContainer}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handlePlayPausePress}>
            <Video
              ref={itemVideoRef} // Use item-specific ref
              style={StyleSheet.absoluteFill}
              source={{ uri: item.videoUrl }}
              shouldPlay={isActive && isPlaying} // Only active video plays
              isMuted={isActive ? false : true} // Only active video is unmuted (global isMuted could be better)
              isLooping
              resizeMode={ResizeMode.COVER}
              onPlaybackStatusUpdate={isActive ? onPlaybackStatusUpdate : undefined} // Only update status for active video
            />
             <Animated.View style={[styles.playPauseIconContainer, { opacity: isActive ? showPlayPauseIconAnim : 0}]}>
              {isPlaying ? ( // This reflects global isPlaying, might need adjustment for individual items
                <Pause size={64} color="rgba(255, 255, 255, 0.7)" />
              ) : (
                <Play size={64} color="rgba(255, 255, 255, 0.7)" />
              )}
            </Animated.View>

            {/* Info Block - Animated */}
            <Animated.View style={[styles.infoBlockContainer, { opacity: infoBlockOpacityAnim, transform: [{ translateY: infoBlockAnimY }] }]}>
              <StyledText variant="button" fontWeight="semiBold" style={styles.creatorHandle}>
                @{item.creator.name.toLowerCase().replace(/\s+/g, '')}
              </StyledText>
              <View style={styles.captionTextContainer}>
                <StyledText variant="body" color="white" numberOfLines={isCaptionExpanded ? undefined : 1} style={styles.captionFullText}>
                  {item.description}
                </StyledText>
                {!isCaptionExpanded && item.description.length > 40 && (
                    <StyledText variant="body" color="textSecondary" style={styles.captionMoreButton} onPress={(e) => { e.stopPropagation(); setIsCaptionExpanded(true); }}>
                    ...more
                    </StyledText>
                )}
              </View>
              <TouchableOpacity style={styles.audioInfoContainer} onPress={() => console.log("Navigate to audio page")}>
                <Music2 size={16} color={theme.colors.white} style={{ marginRight: theme.spacing.sm }} />
                <StyledText variant="small" color="white" numberOfLines={1} style={{ flex: 1 }}>
                  Original Audio - {item.creator.name} - {item.title}
                </StyledText>
              </TouchableOpacity>
            </Animated.View>

            {/* Action Stack - Animated */}
            <Animated.View style={[styles.actionStackContainer, { opacity: actionStackOpacityAnim, transform: [{ translateX: actionStackAnimX }] }]}>
              <TouchableOpacity style={styles.actionStackItem} onPress={() => console.log("Profile: ", item.creator.name)}>
                <Image source={{ uri: item.creator.avatar }} style={styles.creatorAvatar} />
                {/* Follow button logic needs to be per-item if state is not global */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionStackItem} onPress={() => console.log("Like: ", item.id) /* Update global/item like state */}>
                <Heart size={30} color={isLiked && item.id === videosWithValidUrls[currentVideoIndex]?.id ? theme.colors.error : theme.colors.white} fill={isLiked && item.id === videosWithValidUrls[currentVideoIndex]?.id ? theme.colors.error : theme.colors.transparent} />
                <StyledText variant="small" color="white" style={{ marginTop: theme.spacing.xs }}>{item.likes}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionStackItem} onPress={() => console.log("Comment: ", item.id)}>
                <MessageCircle size={30} color={theme.colors.white} />
                <StyledText variant="small" color="white" style={{ marginTop: theme.spacing.xs }}>{item.comments}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionStackItem} onPress={() => console.log("Share: ", item.id)}>
                <Send size={30} color={theme.colors.white} />
                <StyledText variant="small" color="white" style={{ marginTop: theme.spacing.xs }}>Share</StyledText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionStackItem} onPress={() => console.log("More: ", item.id)}>
                <MoreVertical size={30} color={theme.colors.white} />
              </TouchableOpacity>
            </Animated.View>

            {isActive && (
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
            )}
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videosWithValidUrls}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_data, index) => ({
            length: height, // Assuming full screen height for each item
            offset: height * index,
            index,
        })}
      />

      {/* Modals can be kept if they are globally triggered and not part of the reel UI itself */}
      {/* For example, Migration Modal: */}
      <Modal
        visible={showMigrationModal}
        transparent={true}
        animationType="fade"
        animationType="fade"
        onRequestClose={() => {}} // Non-dismissible by back button on Android
      >
        <View style={styles.modalOverlay}>
          <View style={styles.migrationModalContent}>
            <Brain size={48} color={theme.colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />
            <Text style={styles.migrationModalTitle}>Edugram Just Got Smarter!</Text>
            <Text style={styles.migrationModalText}>
              To ensure your feed is perfectly tailored, please take a moment to
              confirm and refine your learning interests.
            </Text>
            <TouchableOpacity
              style={[styles.migrationModalButton, {backgroundColor: theme.colors.primary}]}
              onPress={() => {
                setShowMigrationModal(false);
                console.log('User directed to onboarding for migration.');
                router.push('/onboarding');
              }}
            >
              <Text style={styles.migrationModalButtonText}>Update My Interests</Text>
              <ChevronRight size={20} color={theme.colors.white} style={{ marginLeft: 8 }}/>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quiz Overlay - Can be re-added if triggered from this new player UI */}
      {/* {showQuizOverlay && (
        <QuizScreen
          videoTitle={activeQuizVideoTitle}
          onCloseQuiz={() => {
            setShowQuizOverlay(false);
            setActiveQuizVideoTitle(undefined);
          }}
        />
      )} */}
    </SafeAreaView>
  );
}

// Removed getDifficultyColor as it's not used in the new player-focused UI directly

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black, // Use theme color
  },
  videoPlayerContainer: { // New container for Video and its controls
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
  },
  playPauseIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure icon is tappable over video
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 20 : 10, // More space on iOS for home indicator
    paddingBottom: Platform.OS === 'ios' ? 15 : 0, // Avoid home indicator
    justifyContent: 'flex-end', // Align progress bar to the very bottom of this container
  },
  progressBar: {
    height: 2,
    backgroundColor: theme.colors.primary, // Use theme color
  },
  actionStackContainer: {
    position: 'absolute',
    right: theme.spacing.md, // 16px
    bottom: 80, // Placeholder, adjust based on final Nav Bar height
    alignItems: 'center',
    zIndex: 2,
  },
  actionStackItem: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg, // 24px spacing between items
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  followPlusButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: theme.colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  infoBlockContainer: {
    position: 'absolute',
    bottom: 60, // Placeholder, adjust based on final Nav Bar height
    left: theme.spacing.md, // 16px
    right: width * 0.25, // Allow space for action stack on right, and some margin
    zIndex: 2,
  },
  creatorHandle: {
    color: theme.colors.white, // Direct color from theme
    marginBottom: theme.spacing.sm,
    // fontWeight is part of StyledText variant="button" or can be passed directly
  },
  captionTextContainer: {
    flexDirection: 'row', // To have "...more" on the same line if not expanded and text is short
    alignItems: 'flex-end', // Align "more" button with bottom of text line
    marginBottom: theme.spacing.sm,
  },
  captionFullText: {
     flexShrink: 1, // Allow text to take available space before "more"
  },
  captionMoreButton: {
    color: theme.colors.textSecondary, // Distinct color for "more"
    marginLeft: theme.spacing.xs, // Space before "more"
    // fontWeight: theme.typography.fontWeights.semiBold, // Make "more" stand out
  },
  audioInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.2)', // Optional subtle background for readability
    paddingVertical: theme.spacing.xs,
  },
  // Minimal styles for modals if kept, or they can be removed if not used.
  // The subtask focuses on the video player, so other UI elements are secondary.
  migrationModalContent: {
    backgroundColor: '#1E1E1E', // Slightly different from other modals for distinction
    marginHorizontal: 30,
    padding: theme.spacing.lg,
    borderRadius: theme.borders.borderRadius.lg,
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center',
  },
  migrationModalTitle: { // Example of using theme, but these styles are not the focus
    fontSize: theme.typography.fontSizes.h3,
    fontFamily: theme.typography.fonts.poppinsBold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  migrationModalText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fonts.interRegular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.normal,
  },
  migrationModalButton: { // Example of using theme
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borders.borderRadius.pill,
    width: '100%',
  },
  migrationModalButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.poppinsSemiBold,
    color: theme.colors.white,
  },
   modalOverlay: { // Kept for modals
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center', // Changed to center for modals like migration
    alignItems: 'center',
  },
});