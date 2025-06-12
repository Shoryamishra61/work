import React, { useState, useRef, useEffect } from 'react';
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
import { Play, Heart, MessageCircle, Share, BookOpen, Crown, Lock, Star, MoveHorizontal as MoreHorizontal, Volume2, VolumeX, X, Send, Pause, Filter, TrendingUp, Zap } from 'lucide-react-native'; // Added Zap
import { theme } from '../theme'; // Import theme
import QuizScreen from '../quiz'; // Import QuizScreen

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
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; // Already present, ensure it's used
  tags: string[]; // Existing general tags, might be deprecated or used alongside subTopics
  domain: string; // New field
  subTopics: string[]; // New field
  isCaptionExpanded?: boolean;
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
    tags: ['react', 'hooks', 'javascript'], // Keep for now, or decide if subTopics replaces it
    domain: 'Web Development',
    subTopics: ['React', 'JavaScript', 'Frontend'],
    isCaptionExpanded: false,
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
    domain: 'AI & ML',
    subTopics: ['Neural Networks', 'Deep Learning', 'TensorFlow'],
    isCaptionExpanded: false,
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
    domain: 'Data Science',
    subTopics: ['Python', 'Pandas', 'Matplotlib', 'Data Visualization'],
    isCaptionExpanded: false,
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
    domain: 'Web Development',
    subTopics: ['JavaScript', 'ES6+', 'Performance', 'Node.js'],
    isCaptionExpanded: false,
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
    domain: 'AI & ML',
    subTopics: ['Supervised Learning', 'Algorithms', 'Scikit-learn'],
    isCaptionExpanded: false,
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
    domain: 'Web Development',
    subTopics: ['CSS', 'Responsive Design', 'Flexbox'],
    isCaptionExpanded: false,
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
    domain: 'Data Science',
    subTopics: ['D3.js', 'Interactive Viz', 'JavaScript'],
    isCaptionExpanded: false,
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
    domain: 'DevOps',
    subTopics: ['Docker', 'CI/CD', 'Kubernetes'],
    isCaptionExpanded: false,
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
    domain: 'Web Development',
    subTopics: ['React Patterns', 'State Management', 'Performance Opt.'],
    isCaptionExpanded: false,
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
    domain: 'Backend',
    subTopics: ['SQL', 'Database Design', 'NoSQL'],
    isCaptionExpanded: false,
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
  const scrollViewRef = useRef<ScrollView>(null);
  // const [fadeAnim] = useState(new Animated.Value(1));

  // State for quiz countdown and overlay
  const [showQuizCountdown, setShowQuizCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(5);
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [activeQuizContent, setActiveQuizContent] = useState<Question[] | null>(null); // Placeholder

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (showQuizCountdown && countdownValue > 0) {
      countdownTimer = setTimeout(() => {
        setCountdownValue(prev => prev - 1);
      }, 1000);
    } else if (showQuizCountdown && countdownValue === 0) {
      setShowQuizCountdown(false);
      setShowQuizOverlay(true); // Show quiz overlay when countdown finishes
    }
    return () => clearTimeout(countdownTimer);
  }, [showQuizCountdown, countdownValue]);

  const handleStartMidVideoQuiz = () => {
    // setActiveQuizContent(mockQuestionsFromQuizFile); // Conceptually load quiz
    setCountdownValue(5); // Reset countdown
    setShowQuizCountdown(true);
    setShowQuizOverlay(false); // Ensure quiz overlay is hidden initially
  };

  const handleCloseQuizOverlay = () => {
    setShowQuizOverlay(false);
    // Potentially reset quiz related states if needed, or QuizScreen handles its own reset
  };

  const toggleCaptionExpansion = (videoId: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? { ...video, isCaptionExpanded: !video.isCaptionExpanded }
          : video
      )
    );
  };

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
        {filteredVideos.map((video, index) => (
          <View key={video.id} style={styles.videoCard}>
            <TouchableOpacity 
              style={styles.videoTouchable}
              onPress={() => handlePremiumContent(video)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.videoBackground} />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                style={styles.videoOverlay}
              />

              {video.isPremium && (
                <View style={styles.premiumBadge}>
                  <Crown size={16} color="#FFD700" />
                  <Text style={styles.premiumText}>PRO</Text>
                </View>
              )}

              {/* Invisible Play/Pause - Tap anywhere to toggle */}
              {!video.isPremium && (
                <View style={styles.playingIndicator}>
                  <Text style={styles.playingText}>
                    {video.isPlaying ? '▶ Playing' : '⏸ Paused'}
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.muteButton}
                onPress={() => handleMute(video.id)}
              >
                {video.isMuted ? (
                  <VolumeX size={24} color="#FFFFFF" />
                ) : (
                  <Volume2 size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>

              {/* Difficulty Badge */}
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(video.difficulty) }]}>
                <Text style={styles.difficultyText}>{video.difficulty}</Text>
              </View>
            </TouchableOpacity>

            {/* New Bottom UI Structure */}
            <View style={styles.bottomOverlayContainer}>
              {/* Caption Area */}
              <View style={styles.captionContainer}>
                <Text
                  style={styles.creatorNameBottom}
                  onPress={() => {/* Navigate to creator profile */}}
                >
                  @{video.creator.name}
                  {video.creator.verified && <Star size={14} color={theme.colors.primary} fill={theme.colors.primary} style={{marginLeft: theme.spacing.space_xs}}/>}
                </Text>
                {/* Domain Tag Display */}
                <View style={styles.domainAndDifficultyContainer}>
                  <Text style={styles.domainTagText}>{video.domain}</Text>
                  {/* Difficulty is already shown on the video overlay, but if needed here:
                   <Text style={styles.difficultyTagText}>{video.difficulty}</Text>
                  */}
                </View>
                <Text
                  style={styles.captionText}
                  numberOfLines={video.isCaptionExpanded ? undefined : 2}
                >
                  {video.description}
                </Text>
                {video.description.length > 100 && ( // Simple heuristic for "read more"
                  <TouchableOpacity onPress={() => toggleCaptionExpansion(video.id)}>
                    <Text style={styles.readMoreText}>
                      {video.isCaptionExpanded ? 'Read less' : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Bottom Control Bar */}
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={styles.bottomBarButton}
                  onPress={() => handleLike(video.id)}
                >
                  <Heart
                    size={26}
                    color={video.isLiked ? "#FF3040" : "#FFFFFF"}
                    fill={video.isLiked ? "#FF3040" : "transparent"}
                  />
                  <Text style={styles.bottomBarText}>{formatNumber(video.likes)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bottomBarButton}
                  onPress={handleComment} // Opens the existing comments modal
                >
                  <MessageCircle size={26} color="#FFFFFF" />
                  <Text style={styles.bottomBarText}>{formatNumber(video.comments)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bottomBarButton}
                  onPress={() => handleShare(video)}
                >
                  <Share size={26} color="#FFFFFF" />
                  <Text style={styles.bottomBarText}>{formatNumber(video.shares)}</Text>
                </TouchableOpacity>

                {/* Display Sub-Topics - simplified for this bar */}
                <View style={styles.subTopicsInBar}>
                  {video.subTopics.slice(0, 1).map((subTopic, idx) => ( // Show only first subtopic
                    <View key={idx} style={styles.subTopicBadge}>
                      <Text style={styles.subTopicBadgeText}>{subTopic}</Text>
                    </View>
                  ))}
                  {video.subTopics.length > 1 && ( // If more than one, show "+N"
                     <View style={styles.subTopicBadge}>
                        <Text style={styles.subTopicBadgeText}>+{video.subTopics.length -1}</Text>
                     </View>
                  )}
                </View>

                 <TouchableOpacity
                    style={styles.bottomBarButton}
                    onPress={() => handleSave(video.id)}
                  >
                    <BookOpen size={26} color={theme.colors.textPrimary} />
                     {/* Removed text "Save" to save space if needed, or keep it small */}
                  </TouchableOpacity>

                {/* Temp button to trigger quiz countdown - MOVED to avoid clutter, or integrate better */}
                {/* <TouchableOpacity style={styles.bottomBarButton} onPress={handleStartMidVideoQuiz}>
                   <Zap size={22} color={theme.colors.accent} />
                   <Text style={[styles.bottomBarText, {color: theme.colors.accent, marginLeft: 4}]}>Quiz!</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            {/* End of New Bottom UI Structure */}
          </View>
        ))}
      </ScrollView>

      {/* Quiz Countdown Overlay */}
      {showQuizCountdown && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>Quiz starting in {countdownValue}...</Text>
        </View>
      )}

      {/* Quiz Modal/Overlay */}
      {showQuizOverlay && (
         <Modal
            animationType="slide"
            transparent={true}
            visible={showQuizOverlay}
            onRequestClose={handleCloseQuizOverlay}
          >
            {/* QuizScreen is rendered here, ensure it's styled for overlay */}
            {/* It will take mockQuestions from its own file for now */}
            <QuizScreen isOverlayMode={true} onClose={handleCloseQuizOverlay} />
          </Modal>
      )}

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
    backgroundColor: theme.colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.space_xl,
    paddingTop: theme.spacing.space_xl,
    paddingBottom: theme.spacing.space_sm,
    backgroundColor: theme.colors.backgroundMain,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.radius_full,
    backgroundColor: theme.colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
  },
  videoCard: {
    height: height - 140,
    position: 'relative',
  },
  videoTouchable: {
    flex: 1,
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
  premiumBadge: {
    position: 'absolute',
    top: theme.spacing.space_lg,
    right: theme.spacing.space_lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.space_sm,
    paddingVertical: theme.spacing.space_xs,
    borderRadius: theme.radii.radius_full,
  },
  premiumText: {
    color: theme.colors.accent,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.xs,
    marginLeft: theme.spacing.space_xs,
  },
  muteButton: {
    position: 'absolute',
    top: theme.spacing.space_lg,
    left: theme.spacing.space_lg,
    width: 44,
    height: 44,
    borderRadius: theme.radii.radius_full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: theme.spacing.space_lg + 60 + 70, // Approx above bottom bar + caption
    right: theme.spacing.space_lg,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.space_sm,
    paddingVertical: theme.spacing.space_xs,
    borderRadius: theme.radii.radius_md,
  },
  durationText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.xs,
  },
  playingIndicator: {
    position: 'absolute',
    top: height * 0.2,
    left: theme.spacing.space_lg,
    backgroundColor: theme.colors.success + 'E6',
    paddingHorizontal: theme.spacing.space_md,
    paddingVertical: theme.spacing.space_sm,
    borderRadius: theme.radii.radius_lg,
  },
  playingText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.sm,
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: theme.spacing.space_lg + 60 + 70, // Approx above bottom bar + caption
    left: theme.spacing.space_lg,
    paddingHorizontal: theme.spacing.space_md,
    paddingVertical: theme.spacing.space_sm,
    borderRadius: theme.radii.radius_lg,
  },
  difficultyText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.xs,
  },
  // Existing contentInfo and actionButtons are replaced by bottomOverlayContainer
  // Removed styles: contentInfo, creatorInfo, creatorAvatar, creatorDetails,
  // creatorNameContainer, videoCategory, followButton, videoTitle,
  // videoDescription (old one), tagsContainer (old one), tag (old one), tagText (old one),
  // actionButtons, actionButton, actionText, likedText

  // Styles for New Bottom UI
  bottomOverlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: theme.spacing.space_sm,
  },
  captionContainer: {
    paddingHorizontal: theme.spacing.space_lg,
    paddingBottom: theme.spacing.space_sm,
  },
  creatorNameBottom: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.md,
    marginBottom: theme.spacing.space_xs,
  },
  captionText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.fontSizes.sm * 1.4,
  },
  readMoreText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.space_xs,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    height: 55,
    paddingHorizontal: theme.spacing.space_sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + '4D', // Lighter border, more subtle
  },
  bottomBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.space_sm,
  },
  bottomBarText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.xs,
    marginLeft: theme.spacing.space_xs,
  },
  bottomBarTagText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.xs,
    paddingHorizontal: theme.spacing.space_sm,
    paddingVertical: theme.spacing.space_xs,
    backgroundColor: theme.colors.primary + '33',
    borderRadius: theme.radii.radius_sm,
  },

  // Old styles that might still be used or need cleanup:
  creatorInfo: { // This might be reused for creator info within caption or elsewhere
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
  tagText: { // This style might be from the old layout, new one is bottomBarTagText
    color: '#8B5CF6',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  // ActionButtons and related styles (actionButton, actionText, likedText) are removed
  // as they are incorporated into the new bottomBar or removed for simplification.

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
});
