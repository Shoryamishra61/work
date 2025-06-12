import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // Added for navigation
import { Play, Heart, MessageCircle, Share, BookOpen, Crown, Lock, Star, MoveHorizontal as MoreHorizontal, Volume2, VolumeX, X, Send, Pause, Filter, TrendingUp, Brain, ChevronRight, Maximize, HelpCircle } from 'lucide-react-native'; // Added Maximize, Brain, ChevronRight, HelpCircle

// Design System & Quiz
import theme from './styles/theme';
import QuizScreen from './quiz'; // Assuming quiz.tsx is at the root

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
  isLiked: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
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
  const [videos, setVideos] = useState(mockVideos);
  const [comments, setComments] = useState(mockComments);
  const [showComments, setShowComments] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showMigrationModal, setShowMigrationModal] = useState(false); // Added for migration
  const [controlsVisible, setControlsVisible] = useState(true); // For B4 de-clutter

  // State for Quiz Overlay
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [activeQuizVideoTitle, setActiveQuizVideoTitle] = useState<string | undefined>(undefined);
  // const [currentVideoQuizData, setCurrentVideoQuizData] = useState<any>(null); // For actual quiz data later
  const [quizTriggerVisible, setQuizTriggerVisible] = useState<{[videoId: string]: boolean}>({});
  const quizTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Simulate checking if new onboarding is completed
  const checkIfNewOnboardingCompleted = () => {
    // In a real app, this would check AsyncStorage or similar
    console.log('Simulating check: New onboarding not completed.');
    return false;
  };

  useEffect(() => {
    // Prevent modal from showing if already on onboarding screen (e.g. after pressing back)
    // This is a simple check; a more robust solution might involve global state or route listeners.
    if (router.canGoBack() && router.getPathname() === '/onboarding') {
        return;
    }

    if (!checkIfNewOnboardingCompleted()) {
      setShowMigrationModal(true);
    }
  }, []);


  const handleShowQuiz = (video: VideoContent) => {
    setActiveQuizVideoTitle(video.title);
    // In future, load specific quiz data for video: setCurrentVideoQuizData(video.quizData);
    setShowQuizOverlay(true);
    setQuizTriggerVisible(prev => ({ ...prev, [video.id]: false })); // Hide trigger once quiz is shown
  };

  const scheduleQuizTrigger = useCallback((video: VideoContent) => {
    if (quizTimeoutId.current) {
      clearTimeout(quizTimeoutId.current);
    }
    setQuizTriggerVisible(prev => ({ ...prev, [video.id]: false })); // Hide for current video initially

    if (video.hasQuiz && video.quizTimestamp && video.isPlaying) {
      quizTimeoutId.current = setTimeout(() => {
        console.log(`Quiz trigger for video ${video.id} at ${video.quizTimestamp}s`);
        setQuizTriggerVisible(prev => ({ ...prev, [video.id]: true }));
      }, video.quizTimestamp * 1000);
    }
  }, [videos]); // videos dependency might be broad, consider refining if videos state changes often unnecessarily

  // Effect to schedule quiz trigger when current video changes or its playing state changes
  useEffect(() => {
    const currentVideoData = filteredVideos[currentVideo];
    if (currentVideoData) {
      scheduleQuizTrigger(currentVideoData);
    }

    // Cleanup timeout when component unmounts or dependencies change
    return () => {
      if (quizTimeoutId.current) {
        clearTimeout(quizTimeoutId.current);
      }
    };
  }, [currentVideo, filteredVideos, scheduleQuizTrigger]);


  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleLike = (videoId: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video
      )
    );
  };

  const handleMute = (videoId: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? { ...video, isMuted: !video.isMuted }
          : video
      )
    );
  };

  const handlePlayPause = (videoId: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? { ...video, isPlaying: !video.isPlaying }
          : { ...video, isPlaying: false }
      )
    );
  };

  const handlePremiumContent = (video: VideoContent) => {
    if (video.isPremium) {
      setShowPremiumModal(true);
    } else {
      handlePlayPause(video.id);
    }
  };

  const handleShare = (video: VideoContent) => {
    setVideos(prevVideos =>
      prevVideos.map(v =>
        v.id === video.id
          ? { ...v, shares: v.shares + 1 }
          : v
      )
    );

    if (Platform.OS === 'web') {
      alert(`Shared: ${video.title}`);
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const submitComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        text: newComment.trim(),
        timestamp: 'now',
        likes: 0,
      };
      
      setComments(prevComments => [newCommentObj, ...prevComments]);
      
      const currentVideoData = filteredVideos[currentVideo] || videos[0];
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === currentVideoData.id
            ? { ...video, comments: video.comments + 1 }
            : video
        )
      );
      
      setNewComment('');
      setShowComments(false);
    }
  };

  const handleSave = (videoId: string) => {
    if (Platform.OS === 'web') {
      alert('Video saved to your library!');
    }
  };

  const filteredVideos = videos.filter(video => {
    if (selectedDifficulty && video.difficulty !== selectedDifficulty) return false;
    if (selectedCategory && video.category !== selectedCategory) return false;
    return true;
  });

  const video = filteredVideos[currentVideo] || videos[0];

  const categories = ['All', 'Web Development', 'AI & ML', 'Data Science', 'DevOps', 'Backend'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Filters */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.videoContainer}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 140}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / (height - 140));
          setCurrentVideo(index);
          
          setVideos(prevVideos =>
            prevVideos.map((v, i) => ({
              ...v,
              isPlaying: i === index && !v.isPremium
            }))
          );
        }}
      >
        {filteredVideos.map((videoItem, index) => (
          <View key={videoItem.id} style={styles.videoCardOuter}>
            <TouchableOpacity
              style={styles.videoPlayerArea}
              onPress={() => {
                // Toggle controls visibility first
                setControlsVisible(!controlsVisible);
                // Then, if video is not premium and controls are about to become visible (or were just made visible),
                // and video is not playing, one might want to play it.
                // However, the primary action of tap is now toggling controls.
                // Original premium check logic:
                // if (videoItem.isPremium) {
                //   setShowPremiumModal(true);
                // } else {
                //  handlePlayPause(videoItem.id); // This would play/pause directly
                // }
              }}
              activeOpacity={1} // Ensure full opacity for the touchable area
            >
              <Image source={{ uri: videoItem.thumbnail }} style={styles.videoBackground} />
              
              {/* Removed videoOverlay LinearGradient, can be added back if needed for contrast with text/icons */}

              {/* Caption Placeholder - Renders only if controls are visible */}
              {controlsVisible && (
                <View style={styles.captionContainer}>
                  <Text style={styles.captionText} numberOfLines={2}>
                    This is a placeholder for two lines of captions. Lorem ipsum dolor sit amet... <Text style={styles.captionMore}>more</Text>
                  </Text>
                </View>
              )}

              {/* Bottom Control Bar - Renders only if controls are visible */}
              {controlsVisible && (
                <View style={styles.bottomControlBar}>
                  <TouchableOpacity onPress={() => handlePlayPause(videoItem.id)} style={styles.controlButton}>
                    {videoItem.isPlaying ? <Pause size={24} color="#FFFFFF" /> : <Play size={24} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <View style={styles.progressBarPlaceholder} />
                  <TouchableOpacity onPress={() => handleMute(videoItem.id)} style={styles.controlButton}>
                    {videoItem.isMuted ? <VolumeX size={24} color="#FFFFFF" /> : <Volume2 size={24} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                    <Maximize size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Side Interaction Bar - Renders only if controls are visible */}
              {controlsVisible && (
                <View style={styles.sideInteractionBar}>
                  <TouchableOpacity style={styles.sideButton} onPress={() => handleLike(videoItem.id)}>
                    <Heart size={30} color={videoItem.isLiked ? "#FF3040" : "#FFFFFF"} fill={videoItem.isLiked ? "#FF3040" : "transparent"} />
                    <Text style={[styles.sideButtonText, videoItem.isLiked && styles.likedText]}>{formatNumber(videoItem.likes)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sideButton} onPress={handleComment}>
                    <MessageCircle size={30} color="#FFFFFF" />
                    <Text style={styles.sideButtonText}>{formatNumber(videoItem.comments)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sideButton} onPress={() => handleShare(videoItem)}>
                    <Share size={30} color="#FFFFFF" />
                    <Text style={styles.sideButtonText}>{formatNumber(videoItem.shares)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sideButton} onPress={() => handleSave(videoItem.id)}>
                    <BookOpen size={30} color="#FFFFFF" />
                    <Text style={styles.sideButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sideButton}>
                    <MoreHorizontal size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Premium and Difficulty badges can be re-added here if desired, or in metadata section */}
               {videoItem.isPremium && controlsVisible && (
                <View style={[styles.premiumBadge, styles.badgeVideoOverlay]}>
                  <Crown size={16} color={theme.colors.warning} />
                  <Text style={styles.premiumText}>PRO</Text>
                </View>
              )}

              {/* Quiz Trigger Cue */}
              {quizTriggerVisible[videoItem.id] && videoItem.hasQuiz && (
                <TouchableOpacity
                  style={styles.quizTriggerCue}
                  onPress={() => handleShowQuiz(videoItem)}
                >
                  <HelpCircle size={24} color={theme.colors.white} />
                  <Text style={styles.quizTriggerText}>Quiz</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Metadata Area - Below Video Player */}
            <View style={styles.metadataArea}>
              <View style={styles.creatorInfo}>
                <Image source={{ uri: videoItem.creator.avatar }} style={styles.creatorAvatar} />
                <View style={styles.creatorDetails}>
                  <View style={styles.creatorNameContainer}>
                    <Text style={styles.creatorName}>{videoItem.creator.name}</Text>
                    {videoItem.creator.verified && (
                      <Star size={16} color="#8B5CF6" fill="#8B5CF6" style={{ marginLeft: 4 }}/>
                    )}
                  </View>
                  <Text style={styles.videoCategory}>{videoItem.category} • {videoItem.duration}</Text>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.videoTitle}>{videoItem.title}</Text>
              <Text style={styles.videoDescription} numberOfLines={2}>
                {videoItem.description}
              </Text>
              <View style={styles.tagsContainer}>
                {videoItem.tags.map((tag, tagIndex) => (
                  <View key={tagIndex} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
                 <View style={[styles.tag, {backgroundColor: getDifficultyColor(videoItem.difficulty)}]}>
                    <Text style={styles.tagTextWhite}>{videoItem.difficulty}</Text>
                  </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModal}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Filter Content</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Difficulty Level</Text>
              <View style={styles.filterOptions}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.filterOption,
                      (selectedDifficulty === difficulty || (difficulty === 'All' && !selectedDifficulty)) && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedDifficulty(difficulty === 'All' ? '' : difficulty)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      (selectedDifficulty === difficulty || (difficulty === 'All' && !selectedDifficulty)) && styles.filterOptionTextSelected
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      (selectedCategory === category || (category === 'All' && !selectedCategory)) && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedCategory(category === 'All' ? '' : category)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      (selectedCategory === category || (category === 'All' && !selectedCategory)) && styles.filterOptionTextSelected
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.applyFiltersButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.commentsModal}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentTime}>{comment.timestamp}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentLike}>
                        <Heart size={16} color="#666666" />
                        <Text style={styles.commentLikeText}>{comment.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.replyText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentInput}>
              <TextInput
                style={styles.commentTextInput}
                placeholder="Add a comment..."
                placeholderTextColor="#666666"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, newComment.trim() && styles.sendButtonActive]}
                onPress={submitComment}
                disabled={!newComment.trim()}
              >
                <Send size={20} color={newComment.trim() ? "#8B5CF6" : "#666666"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Premium Modal */}
      <Modal
        visible={showPremiumModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.premiumModalContent}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.premiumModalHeader}
            >
              <Crown size={60} color="#FFD700" />
              <Text style={styles.premiumModalTitle}>Unlock Premium Content</Text>
              <Text style={styles.premiumModalSubtitle}>
                Get access to advanced tutorials and exclusive content
              </Text>
            </LinearGradient>

            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeature}>
                <Star size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Unlimited premium videos</Text>
              </View>
              <View style={styles.premiumFeature}>
                <BookOpen size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Downloadable resources</Text>
              </View>
              <View style={styles.premiumFeature}>
                <Heart size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Ad-free experience</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MessageCircle size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Priority support</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.upgradeButton}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.upgradeButtonGradient}
              >
                <Text style={styles.upgradeButtonText}>Start Free Trial - $5.99/month</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={styles.closeModalText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Migration Modal */}
      <Modal
        visible={showMigrationModal}
        transparent={true}
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
                // Simulate flag that user has been directed, actual flag after onboarding completion
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

      {/* Quiz Overlay */}
      {showQuizOverlay && (
        <QuizScreen
          videoTitle={activeQuizVideoTitle}
          onCloseQuiz={() => {
            setShowQuizOverlay(false);
            setActiveQuizVideoTitle(undefined);
            // Potentially mark quiz as "seen" for this session/video to avoid immediate re-trigger
          }}
          // quizData={currentVideoQuizData} // For future use
        />
      )}
    </SafeAreaView>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Beginner': return '#10B981';
    case 'Intermediate': return '#F59E0B';
    case 'Advanced': return '#EF4444';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
  },
  videoCard: { // Renamed to videoCardOuter
    // height: height - 140, // This will be adjusted by content below video
    // position: 'relative', // No longer needed if metadata is below
    backgroundColor: '#000000', // Ensure card background is black
    paddingBottom: 10, // Space for metadata
  },
  videoCardOuter: { // New parent for each full screen item
    height: height - (Platform.OS === 'ios' ? 140 : 120), // Approximate full viewport minus headers/tabs
    // backgroundColor: '#0c0c0c', // Darker background for the whole item
    // marginBottom: 10, // if we want separation between items in scroll, though current is paging
  },
  videoPlayerArea: {
    flex: 1, // Video player takes available space within its parent
    backgroundColor: '#000000',
    justifyContent: 'flex-end', // For bottom controls and captions
    position: 'relative', // For positioning overlays like controls
  },
  videoBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  premiumBadge: { // Original style, might need adjustment or use badgeVideoOverlay
    position: 'absolute',
    top: 20, // Adjusted position
    left: 20, // Adjusted position
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: '#FFD700',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    marginLeft: 4,
  },
  // muteButton, durationBadge, playingIndicator, difficultyBadge are removed as their functionality is integrated elsewhere or deferred.

  // Styles for metadata area, moved below video
  metadataArea: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10, // Added padding at bottom of metadata
    backgroundColor: '#000000', // Ensure background for metadata area
  },
  creatorInfo: { // Copied from contentInfo
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 6,
  },
  videoCategory: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  videoDescription: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  tagText: {
    color: '#8B5CF6',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  // actionButtons renamed to sideInteractionBar
  sideInteractionBar: {
    position: 'absolute',
    right: 10,
    bottom: 20, // Position above bottom control bar or adjust as needed
    alignItems: 'center',
    zIndex: 10, // Ensure it's above video content if not using controlsVisible for it
  },
  sideButton: { // Replaces actionButton
    alignItems: 'center',
    marginBottom: 20, // Spacing between buttons
  },
  sideButtonText: { // Replaces actionText
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  likedText: { // Unchanged
    color: '#FF3040',
  },

  // New styles for Bottom Control Bar
  bottomControlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 10, // Ensure it's above video content
  },
  controlButton: {
    padding: 8,
  },
  progressBarPlaceholder: {
    flex: 1,
    height: 4, // Thin bar
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 10,
    borderRadius: 2,
  },

  // New styles for Caption Placeholder
  captionContainer: {
    position: 'absolute',
    bottom: 70, // Above bottom control bar
    left: 15,
    right: 15,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    zIndex: 10,
  },
  captionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'left',
  },
  captionMore: {
    fontFamily: 'Inter-SemiBold',
    color: '#A0A0A0',
  },
  badgeVideoOverlay: { // General style for badges on video if controls are visible
     backgroundColor: 'rgba(0, 0, 0, 0.7)',
     paddingHorizontal: 10,
     paddingVertical: 5,
     borderRadius: 15,
  },
   tagTextWhite: { // For difficulty tag in metadata
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  quizTriggerCue: {
    position: 'absolute',
    bottom: 80, // Adjust to be above bottom controls, or in a corner
    right: 20,
    backgroundColor: theme.colors.primary + 'AA', // Semi-transparent primary
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borders.borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20, // Ensure it's above other elements if controls are also visible
  },
  quizTriggerText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fonts.interSemiBold,
    fontSize: theme.typography.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  filtersModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: 20,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  filtersTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterSectionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  filterOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterOptionText: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  applyFiltersButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  commentsModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  commentsTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginRight: 8,
  },
  commentTime: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  commentText: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  commentLikeText: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  replyText: {
    color: '#666666',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  premiumModalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  premiumModalHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  premiumModalTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginTop: 16,
    textAlign: 'center',
  },
  premiumModalSubtitle: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  premiumFeatures: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumFeatureText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  upgradeButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  upgradeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  closeModalButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  closeModalText: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  // Styles for Migration Modal
  migrationModalContent: {
    backgroundColor: '#1E1E1E', // Slightly different from other modals for distinction
    marginHorizontal: 30,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center', // Center content for when modalOverlay is flex-end
  },
  migrationModalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  migrationModalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  migrationModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
  },
  migrationModalButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});