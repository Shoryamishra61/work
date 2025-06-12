import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Share, MoveHorizontal as MoreHorizontal, Play, Heart, MessageCircle, Grid3x3 as Grid, List, Crown, Star, Users, Award, TrendingUp, BookOpen, Zap, Trophy, Target, Calendar } from 'lucide-react-native';

interface UserVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
  duration: string;
  isPremium: boolean;
}

interface UserStats {
  followers: string;
  following: string;
  likes: string;
  videos: number;
  streak: number;
  totalWatchTime: string;
  badges: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
  color: string;
}

const mockUserVideos: UserVideo[] = [
  {
    id: '1',
    title: 'React Hooks Explained',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    views: '125K',
    likes: '8.9K',
    duration: '2:45',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Neural Networks Basics',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    views: '89K',
    likes: '6.2K',
    duration: '3:12',
    isPremium: true,
  },
  {
    id: '3',
    title: 'Python Data Analysis',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
    views: '67K',
    likes: '4.8K',
    duration: '4:30',
    isPremium: false,
  },
  {
    id: '4',
    title: 'JavaScript ES6 Features',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    views: '234K',
    likes: '12.1K',
    duration: '1:58',
    isPremium: false,
  },
  {
    id: '5',
    title: 'Machine Learning Intro',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    views: '156K',
    likes: '9.7K',
    duration: '5:15',
    isPremium: true,
  },
  {
    id: '6',
    title: 'CSS Grid Layout',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
    views: '78K',
    likes: '5.3K',
    duration: '3:42',
    isPremium: false,
  },
];

const userStats: UserStats = {
  followers: '125K',
  following: '234',
  likes: '1.2M',
  videos: mockUserVideos.length,
  streak: 15,
  totalWatchTime: '45h 30m',
  badges: 12,
};

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'AI Explorer',
    icon: '🤖',
    description: 'Finished 5 AI/ML videos', // Shortened
    earnedDate: '2024-01-15',
    color: '#8B5CF6',
  },
  {
    id: '2',
    name: 'Learning Streak',
    icon: '🔥',
    description: 'Achieved a 15-day streak', // Shortened
    earnedDate: '2024-01-20',
    color: '#EF4444',
  },
  {
    id: '3',
    name: 'Code Master',
    icon: '💻',
    description: 'Completed 10 code videos', // Shortened
    earnedDate: '2024-01-10',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'Community Helper',
    icon: '🤝',
    description: 'Helped 50+ members', // Shortened
    earnedDate: '2024-01-05',
    color: '#F59E0B',
  },
];

export default function ProfileScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const renderVideoGrid = ({ item }: { item: UserVideo }) => (
    <TouchableOpacity style={styles.gridVideoItem}>
      <View style={styles.gridVideoThumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.gridVideoThumbnail} />
        <View style={styles.gridVideoOverlay}>
          <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={styles.gridVideoDuration}>
          <Text style={styles.gridVideoDurationText}>{item.duration}</Text>
        </View>
        {item.isPremium && (
          <View style={styles.gridVideoPremiumBadge}>
            <Crown size={12} color="#FFD700" />
          </View>
        )}
      </View>
      <Text style={styles.gridVideoTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.gridVideoStats}>
        <Text style={styles.gridVideoViews}>{item.views} views</Text>
        <Text style={styles.gridVideoLikes}>• {item.likes} likes</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVideoList = ({ item }: { item: UserVideo }) => (
    <TouchableOpacity style={styles.listVideoItem}>
      <View style={styles.listVideoThumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.listVideoThumbnail} />
        <View style={styles.listVideoOverlay}>
          <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={styles.listVideoDuration}>
          <Text style={styles.listVideoDurationText}>{item.duration}</Text>
        </View>
        {item.isPremium && (
          <View style={styles.listVideoPremiumBadge}>
            <Crown size={14} color="#FFD700" />
          </View>
        )}
      </View>
      <View style={styles.listVideoInfo}>
        <Text style={styles.listVideoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.listVideoStats}>
          <Text style={styles.listVideoViews}>{item.views} views</Text>
          <Text style={styles.listVideoLikes}>• {item.likes} likes</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.listVideoMenu}>
        <MoreHorizontal size={20} color="#CCCCCC" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#1a1a1a', '#000000']}
          style={styles.profileHeader}
        >
          <View style={styles.profileTop}>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Share size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200' }} 
              style={styles.profileAvatar} 
            />
            <View style={styles.profileDetails}>
              <View style={styles.profileNameContainer}>
                <Text style={styles.profileName}>Alex Rodriguez</Text>
                <Star size={20} color="#8B5CF6" fill="#8B5CF6" />
              </View>
              <Text style={styles.profileUsername}>@alexdev</Text>
              <Text style={styles.profileBio}>
                Full Stack Developer 💻 | Teaching React, Node.js & AI | 
                Building the future one video at a time 🚀
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.secondaryStatNumber}>{userStats.following}</Text>
              <Text style={styles.secondaryStatLabel}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.secondaryStatNumber}>{userStats.likes}</Text>
              <Text style={styles.secondaryStatLabel}>Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => setShowProgressModal(true)} // Videos is a primary stat
            >
              <Text style={styles.statNumber}>{userStats.videos}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </TouchableOpacity>
          </View>

          {/* Learning Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <Zap size={18} color="#EF4444" /> {/* Icon size reduced */}
              <Text style={styles.progressText}>{userStats.streak} day streak</Text>
            </View>
            <View style={styles.progressItem}>
              <Clock size={18} color="#10B981" /> {/* Icon size reduced */}
              <Text style={styles.progressText}>{userStats.totalWatchTime} watched</Text>
            </View>
            <View style={styles.progressItem}>
              <Award size={18} color="#F59E0B" /> {/* Icon size reduced */}
              <Text style={styles.progressText}>{userStats.badges} badges earned</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <MessageCircle size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.premiumButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <Crown size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Videos ({userStats.videos})</Text>
            <View style={styles.viewModeToggle}>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('grid')}
              >
                <Grid size={20} color={viewMode === 'grid' ? '#FFFFFF' : '#666666'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('list')}
              >
                <List size={20} color={viewMode === 'list' ? '#FFFFFF' : '#666666'} />
              </TouchableOpacity>
            </View>
          </View>

          {viewMode === 'grid' ? (
            <FlatList
              data={mockUserVideos}
              renderItem={renderVideoGrid}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          ) : (
            <FlatList
              data={mockUserVideos}
              renderItem={renderVideoList}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Progress Modal */}
      <Modal
        visible={showProgressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProgressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.progressModalContent}>
            <View style={styles.progressModalHeader}>
              <Text style={styles.progressModalTitle}>My Progress</Text>
              <TouchableOpacity onPress={() => setShowProgressModal(false)}>
                <Text style={styles.closeModalText}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.progressModalScroll}>
              <View style={styles.progressStats}>
                <View style={styles.progressStatCard}>
                  <Zap size={24} color="#EF4444" />
                  <Text style={styles.progressStatNumber}>{userStats.streak}</Text>
                  <Text style={styles.progressStatLabel}>Day Streak</Text>
                </View>
                <View style={styles.progressStatCard}>
                  <Clock size={24} color="#10B981" />
                  <Text style={styles.progressStatNumber}>{userStats.totalWatchTime}</Text>
                  <Text style={styles.progressStatLabel}>Total Time</Text>
                </View>
                <View style={styles.progressStatCard}>
                  <Trophy size={24} color="#F59E0B" />
                  <Text style={styles.progressStatNumber}>{userStats.badges}</Text>
                  <Text style={styles.progressStatLabel}>Badges</Text>
                </View>
              </View>

              <Text style={styles.badgesTitle}>Recent Badges</Text>
              <View style={styles.badgesContainer}>
                {mockBadges.map((badge) => (
                  <View key={badge.id} style={styles.badgeItem}>
                    <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                      <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                    </View>
                    <View style={styles.badgeInfo}>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <Text style={styles.badgeDescription}>{badge.description}</Text>
                      <Text style={styles.badgeDate}>Earned {badge.earnedDate}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
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
              <Text style={styles.premiumModalTitle}>Support Alex</Text>
              <Text style={styles.premiumModalSubtitle}>
                Get exclusive content and support your favorite creator
              </Text>
            </LinearGradient>

            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeature}>
                <Award size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Premium video access</Text>
              </View>
              <View style={styles.premiumFeature}>
                <Users size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Exclusive community</Text>
              </View>
              <View style={styles.premiumFeature}>
                <TrendingUp size={20} color="#FFD700" />
                <Text style={styles.premiumFeatureText}>Early content access</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.subscribeButton}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.subscribeButtonGradient}
              >
                <Text style={styles.subscribeButtonText}>Subscribe for $4.99/month</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  profileUsername: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 4, // Add some horizontal padding
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  // Specific styles for less prominent stats
  secondaryStatNumber: {
    fontSize: 18, // Reduced font size
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  secondaryStatLabel: {
    fontSize: 12, // Reduced font size
    fontFamily: 'Inter-Regular',
    color: '#A0A0A0', // Lighter color
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly more subtle background
    borderRadius: 16,
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1, // Distribute space
  },
  progressText: {
    fontSize: 11, // Reduced font size
    fontFamily: 'Inter-Medium',
    color: '#E0E0E0', // Slightly dimmer white
    marginTop: 3, // Reduced margin
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
  },
  followingButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  followingButtonText: {
    color: '#8B5CF6',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  premiumButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 18, // Standardized size
    fontFamily: 'Poppins-SemiBold', // Standardized font
    color: '#FFFFFF',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 4,
  },
  viewModeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridVideoItem: {
    width: '48%',
    marginBottom: 20,
  },
  gridVideoThumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gridVideoThumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  gridVideoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridVideoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridVideoDurationText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  gridVideoPremiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 4,
    borderRadius: 8,
  },
  gridVideoTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  gridVideoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridVideoViews: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 11, // Reduced font size
  },
  gridVideoLikes: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 11, // Reduced font size
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listVideoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  listVideoThumbnailContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  listVideoThumbnail: {
    width: 80,
    height: 60,
    resizeMode: 'cover',
  },
  listVideoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listVideoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listVideoDurationText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  listVideoPremiumBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    borderRadius: 6,
  },
  listVideoInfo: {
    flex: 1,
  },
  listVideoTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  listVideoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listVideoViews: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12, // Reduced font size
  },
  listVideoLikes: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12, // Reduced font size
    marginLeft: 4,
  },
  listVideoMenu: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  progressModalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  progressModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  progressModalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  progressModalScroll: {
    flex: 1,
    padding: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  progressStatCard: {
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
  },
  progressStatNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  progressStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  badgesTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  badgesContainer: {
    paddingBottom: 20,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
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
  subscribeButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  subscribeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
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
    color: '#8B5CF6',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});