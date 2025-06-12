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
import { router } from 'expo-router';
import { Settings, Share, MoveHorizontal as MoreHorizontal, Play, Heart, MessageCircle, Grid3x3 as Grid, List, Crown, Star, Users, Award, TrendingUp, BookOpen, Zap, Trophy, Target, Calendar, ChevronRight } from 'lucide-react-native';
import { theme } from '../theme'; // Import the theme

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
  // badges: number; // Will be replaced by badges array length
  badges: Badge[]; // Changed to array of Badge objects
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
  // badges: 12, // This will now be derived from the length of the badges array
  badges: [ // Populate with more descriptive badges
    {
      id: '1',
      name: 'AI Novice Completion',
      icon: '🎓',
      description: 'Completed the "AI Fundamentals" course.',
      earnedDate: '2024-03-10',
      color: theme.colors.primary,
    },
    {
      id: '2',
      name: '5-Day Learning Streak',
      icon: '🔥',
      description: 'Learned for 5 days in a row!',
      earnedDate: '2024-03-15',
      color: theme.colors.accent,
    },
    {
      id: '3',
      name: 'Web Dev Starter',
      icon: '💻',
      description: 'Watched 10 videos in Web Development.',
      earnedDate: '2024-03-18',
      color: theme.colors.secondary,
    },
    {
      id: '4',
      name: 'First Community Post',
      icon: '💬',
      description: 'Shared your first post with the community.',
      earnedDate: '2024-03-20',
      color: '#3B82F6', // Example: a blue color from theme potential
    },
    {
      id: '5',
      name: 'Perfect Quiz Score',
      icon: '🎯',
      description: 'Achieved 100% on a quiz.',
      earnedDate: '2024-03-22',
      color: theme.colors.accent, // Using accent again
    }
  ],
};

// mockBadges constant can be removed if userStats.badges is the source of truth
// const mockBadges: Badge[] = [ ... ];

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
              // onPress={() => setShowProgressModal(true)} // OLD TRIGGER - REMOVED
            >
              <Text style={styles.statNumber}>{userStats.videos}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </TouchableOpacity>
          </View>

          {/* Learning Progress */}
          <View style={styles.progressContainer}>
            <TouchableOpacity style={styles.progressItem} onPress={() => {/* Future: Navigate to streak details */}}>
              <Zap size={18} color={theme.colors.error} />
              <Text style={styles.progressText}>{userStats.streak} day streak</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.progressItem} onPress={() => {/* Future: Navigate to watch time details */}}>
              <Clock size={18} color={theme.colors.success} />
              <Text style={styles.progressText}>{userStats.totalWatchTime} watched</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.progressItem} onPress={() => setShowProgressModal(true)}> {/* NEW TRIGGER */}
              <Award size={18} color={theme.colors.accent} />
              <Text style={styles.progressText}>{userStats.badges.length} badges earned</Text>
            </TouchableOpacity>
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

        {/* Manage Interests Button */}
        <TouchableOpacity
          style={styles.manageInterestsButton}
          onPress={() => router.push('/update-interests')}
        >
          <View style={styles.manageInterestsIconContainer}>
            <List size={20} color="#8B5CF6" />
          </View>
          <Text style={styles.manageInterestsText}>Manage My Interests</Text>
          <ChevronRight size={20} color="#666666" />
        </TouchableOpacity>

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
                  <Trophy size={24} color={theme.colors.accent} />
                  <Text style={styles.progressStatNumber}>{userStats.badges.length}</Text>
                  <Text style={styles.progressStatLabel}>Badges</Text>
                </View>
              </View>

              <Text style={styles.badgesTitle}>My Badges</Text>
              <View style={styles.badgesContainer}>
                {userStats.badges.length === 0 ? (
                  <Text style={styles.emptyBadgeText}>No badges earned yet. Keep learning to unlock them!</Text>
                ) : (
                  userStats.badges.map((badge) => (
                    <View key={badge.id} style={styles.badgeItem}>
                      <View style={[styles.badgeIcon, { backgroundColor: badge.color || theme.colors.backgroundElevated }]}>
                        <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                      </View>
                      <View style={styles.badgeInfo}>
                        <Text style={styles.badgeName}>{badge.name}</Text>
                        <Text style={styles.badgeDescription}>{badge.description}</Text>
                        <Text style={styles.badgeDate}>Earned: {badge.earnedDate}</Text>
                      </View>
                    </View>
                  ))
                )}
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
    backgroundColor: theme.colors.backgroundMain,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: theme.spacing.space_xl,
    paddingTop: theme.spacing.space_xl,
    paddingBottom: theme.spacing.space_xxxl,
  },
  profileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.space_xl,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.radius_full,
    backgroundColor: theme.colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.radius_full,
    backgroundColor: theme.colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.space_xxxl,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: theme.radii.radius_full,
    marginBottom: theme.spacing.space_lg,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.space_xs,
  },
  profileName: {
    fontSize: theme.typography.fontSizes.xxl,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.space_sm,
  },
  profileUsername: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.space_md,
  },
  profileBio: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSizes.md * 1.5,
    paddingHorizontal: theme.spacing.space_xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.space_xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.space_xs,
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.space_xs,
  },
  secondaryStatNumber: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  secondaryStatLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.space_xs,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.backgroundElevated, // Adjusted
    borderRadius: theme.radii.radius_lg,
    paddingVertical: theme.spacing.space_md,
    paddingHorizontal: theme.spacing.space_sm,
    marginBottom: theme.spacing.space_xl,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textPrimary, // Adjusted from E0E0E0
    marginTop: theme.spacing.space_xs,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.space_xxxl,
    paddingVertical: theme.spacing.space_md,
    borderRadius: theme.radii.radius_full,
    marginRight: theme.spacing.space_md,
  },
  followingButton: {
    backgroundColor: theme.colors.primary + '33', // Tinted background
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  followButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.md,
  },
  followingButtonText: {
    color: theme.colors.primary,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.radius_full,
    backgroundColor: theme.colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.space_md,
  },
  premiumButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.radius_full,
    backgroundColor: theme.colors.accent + '33', // Tinted background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  contentSection: {
    paddingHorizontal: theme.spacing.space_xl,
    paddingTop: theme.spacing.space_xl,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.space_xl,
  },
  contentTitle: { // Already updated in previous step, ensure consistency
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radii.radius_full,
    padding: theme.spacing.space_xs,
  },
  viewModeButton: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.radius_full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  gridContainer: {
    paddingBottom: theme.spacing.space_xl,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridVideoItem: {
    width: '48%', // Keep as is for 2-column layout
    marginBottom: theme.spacing.space_xl,
  },
  gridVideoThumbnailContainer: {
    position: 'relative',
    borderRadius: theme.radii.radius_md,
    overflow: 'hidden',
    marginBottom: theme.spacing.space_sm,
  },
  gridVideoThumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  gridVideoOverlay: { // Keep as is, specific styling
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: theme.radii.radius_md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridVideoDuration: { // Keep as is
    position: 'absolute',
    bottom: theme.spacing.space_sm,
    right: theme.spacing.space_sm,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radii.radius_sm,
  },
  gridVideoDurationText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.xs,
  },
  gridVideoPremiumBadge: { // Keep as is
    position: 'absolute',
    top: theme.spacing.space_sm,
    right: theme.spacing.space_sm,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: theme.spacing.space_xs,
    borderRadius: theme.radii.radius_sm,
  },
  gridVideoTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.sm,
    lineHeight: theme.typography.fontSizes.sm * 1.3,
    marginBottom: theme.spacing.space_xs,
  },
  gridVideoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridVideoViews: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.xs,
  },
  gridVideoLikes: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.xs,
    marginLeft: theme.spacing.space_xs,
  },
  listContainer: {
    paddingBottom: theme.spacing.space_xl,
  },
  listVideoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radii.radius_md,
    padding: theme.spacing.space_md,
    marginBottom: theme.spacing.space_md,
  },
  listVideoThumbnailContainer: {
    position: 'relative',
    borderRadius: theme.radii.radius_sm,
    overflow: 'hidden',
    marginRight: theme.spacing.space_md,
  },
  listVideoThumbnail: { // Keep as is
    width: 80,
    height: 60,
    resizeMode: 'cover',
  },
  listVideoOverlay: { // Keep as is
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: theme.radii.radius_lg, // Or full for circle
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listVideoDuration: { // Keep as is
    position: 'absolute',
    bottom: theme.spacing.space_xs,
    right: theme.spacing.space_xs,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: theme.spacing.space_xs,
    paddingVertical: 2,
    borderRadius: theme.radii.radius_sm,
  },
  listVideoDurationText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.xs,
  },
  listVideoPremiumBadge: { // Keep as is
    position: 'absolute',
    top: theme.spacing.space_xs,
    right: theme.spacing.space_xs,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    borderRadius: theme.radii.radius_sm,
  },
  listVideoInfo: {
    flex: 1,
  },
  listVideoTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.md,
    lineHeight: theme.typography.fontSizes.md * 1.3,
    marginBottom: theme.spacing.space_xs,
  },
  listVideoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listVideoViews: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.sm, // Was 12, now sm (14)
  },
  listVideoLikes: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.sm, // Was 12, now sm (14)
    marginLeft: theme.spacing.space_xs,
  },
  listVideoMenu: { // Keep as is
    width: 40,
    height: 40,
    borderRadius: theme.radii.radius_full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Specific to modals
    justifyContent: 'flex-end',
  },
  progressModalContent: {
    backgroundColor: theme.colors.backgroundSurface,
    borderTopLeftRadius: theme.radii.radius_xl,
    borderTopRightRadius: theme.radii.radius_xl,
    maxHeight: '80%',
  },
  progressModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.space_xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  progressModalTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  progressModalScroll: {
    flex: 1, // This was missing, important for ScrollView
    padding: theme.spacing.space_xl,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.space_xxxl,
  },
  progressStatCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radii.radius_lg,
    padding: theme.spacing.space_lg,
    minWidth: 80, // Keep for layout
  },
  progressStatNumber: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.space_sm,
  },
  progressStatLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.space_xs,
  },
  badgesTitle: { // Already Poppins-SemiBold 18px
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.space_lg,
  },
  badgesContainer: {
    paddingBottom: theme.spacing.space_xl,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.radii.radius_md,
    padding: theme.spacing.space_lg,
    marginBottom: theme.spacing.space_md,
  },
  badgeIcon: { // Keep as is
    width: 48,
    height: 48,
    borderRadius: theme.radii.radius_full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.space_lg,
  },
  badgeEmoji: {
    fontSize: theme.typography.fontSizes.xxl, // Was 24
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.space_xs,
  },
  badgeDescription: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.space_xs,
  },
  badgeDate: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textMuted,
  },
  emptyBadgeText: {
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.space_xxxl,
  },
  premiumModalContent: {
    backgroundColor: theme.colors.backgroundSurface,
    borderTopLeftRadius: theme.radii.radius_xl,
    borderTopRightRadius: theme.radii.radius_xl,
    overflow: 'hidden',
  },
  premiumModalHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.space_xxxl,
    paddingHorizontal: theme.spacing.space_xl,
  },
  premiumModalTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyHeadings,
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.xxl,
    marginTop: theme.spacing.space_lg,
  },
  premiumModalSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.md,
    marginTop: theme.spacing.space_sm,
    textAlign: 'center',
  },
  premiumFeatures: {
    paddingHorizontal: theme.spacing.space_xl,
    paddingVertical: theme.spacing.space_xxxl,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.space_lg,
  },
  premiumFeatureText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.fontSizes.md,
    marginLeft: theme.spacing.space_md,
  },
  subscribeButton: {
    marginHorizontal: theme.spacing.space_xl,
    borderRadius: theme.radii.radius_full,
    overflow: 'hidden',
    marginBottom: theme.spacing.space_lg,
  },
  subscribeButtonGradient: {
    paddingVertical: theme.spacing.space_lg,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyPrimary, // Or Headings
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.lg,
  },
  closeModalButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.space_lg,
    marginBottom: theme.spacing.space_xl,
  },
  closeModalText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.md,
  },
  manageInterestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    paddingVertical: theme.spacing.space_lg,
    paddingHorizontal: theme.spacing.space_xl,
    borderRadius: theme.radii.radius_lg,
    marginHorizontal: theme.spacing.space_xl,
    marginTop: theme.spacing.space_xl,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  manageInterestsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.radius_full,
    backgroundColor: theme.colors.primary + '26', // Lighter tint
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.space_lg,
  },
  manageInterestsText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
  },
  bottomSpacing: {
    height: 100, // Keep as is for scroll runway
  },
});
[end of profile.tsx]
