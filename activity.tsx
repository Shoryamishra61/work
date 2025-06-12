import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Share, 
  Award,
  TrendingUp,
  Clock,
  Bell,
  Settings
} from 'lucide-react-native';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'achievement' | 'trending';
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content?: {
    title: string;
    thumbnail: string;
  };
  message: string;
  timestamp: string;
  isRead: boolean;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    content: {
      title: 'React Hooks Explained',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    message: 'liked your video',
    timestamp: '2m ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    content: {
      title: 'Neural Networks in 60 Seconds',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    message: 'commented: "This is exactly what I needed! Great explanation 🔥"',
    timestamp: '15m ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'follow',
    user: {
      name: 'Maya Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true,
    },
    message: 'started following you',
    timestamp: '1h ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'achievement',
    user: {
      name: 'Edugram',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    message: 'Congratulations! You\'ve reached 1,000 followers 🎉',
    timestamp: '2h ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'trending',
    user: {
      name: 'Edugram',
      avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    content: {
      title: 'Python Data Analysis',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    message: 'Your video is trending! 🚀 It has 10K+ views',
    timestamp: '4h ago',
    isRead: true,
  },
  {
    id: '6',
    type: 'share',
    user: {
      name: 'TechLearner23',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    content: {
      title: 'AI Fundamentals',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    message: 'shared your video',
    timestamp: '6h ago',
    isRead: true,
  },
];

export default function ActivityScreen() {
  const [activities, setActivities] = useState(mockActivities);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} color="#FF3040" fill="#FF3040" />;
      case 'comment':
        return <MessageCircle size={20} color="#1DA1F2" />;
      case 'follow':
        return <UserPlus size={20} color="#10B981" />;
      case 'share':
        return <Share size={20} color="#8B5CF6" />;
      case 'achievement':
        return <Award size={20} color="#FFD700" />;
      case 'trending':
        return <TrendingUp size={20} color="#FF6B6B" />;
      default:
        return <Bell size={20} color="#CCCCCC" />;
    }
  };

  const markAsRead = (activityId: string) => {
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === activityId
          ? { ...activity, isRead: true }
          : activity
      )
    );
  };

  const markAllAsRead = () => {
    setActivities(prevActivities =>
      prevActivities.map(activity => ({ ...activity, isRead: true }))
    );
  };

  const filteredActivities = filter === 'unread' 
    ? activities.filter(activity => !activity.isRead)
    : activities;

  const unreadCount = activities.filter(activity => !activity.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Activity</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Text>
          </TouchableOpacity>

          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={60} color="#666666" />
            <Text style={styles.emptyStateTitle}>
              {filter === 'unread' ? 'All caught up!' : 'No activity yet'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {filter === 'unread' 
                ? 'You have no unread notifications'
                : 'Start creating content to see activity here'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.activitiesList}>
            {filteredActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityItem,
                  !activity.isRead && styles.activityItemUnread
                ]}
                onPress={() => markAsRead(activity.id)}
              >
                <View style={styles.activityLeft}>
                  <Image 
                    source={{ uri: activity.user.avatar }} 
                    style={styles.userAvatar} 
                  />
                  <View style={styles.activityIcon}>
                    {getActivityIcon(activity.type)}
                  </View>
                </View>

                <View style={styles.activityContent}>
                  <View style={styles.activityText}>
                    <Text style={styles.activityMessage}>
                      <Text style={styles.userName}>{activity.user.name}</Text>
                      {activity.user.verified && ' ✓ '}
                      <Text style={styles.messageText}>{activity.message}</Text>
                    </Text>
                    <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                  </View>

                  {activity.content && (
                    <View style={styles.contentPreview}>
                      <Image 
                        source={{ uri: activity.content.thumbnail }} 
                        style={styles.contentThumbnail} 
                      />
                      <Text style={styles.contentTitle} numberOfLines={2}>
                        {activity.content.title}
                      </Text>
                    </View>
                  )}
                </View>

                {!activity.isRead && (
                  <View style={styles.unreadIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  filterText: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#000000',
  },
  markAllButton: {
    marginLeft: 'auto',
  },
  markAllText: {
    color: '#1DA1F2',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  activitiesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12, // Reduced padding
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  activityItemUnread: {
    backgroundColor: 'rgba(29, 161, 242, 0.1)',
    borderColor: 'rgba(29, 161, 242, 0.3)',
  },
  activityLeft: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 40, // Reduced size
    height: 40, // Reduced size
    borderRadius: 20, // Adjusted border radius
  },
  activityIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20, // Reduced size
    height: 20, // Reduced size
    borderRadius: 10, // Adjusted border radius
    backgroundColor: '#000000', // Keep background for icon visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0, // Ensure border is removed
    borderColor: '#1a1a1a',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    marginBottom: 8,
  },
  activityMessage: {
    fontSize: 14, // Reduced font size
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20, // Adjusted line height
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  messageText: {
    color: '#CCCCCC',
  },
  activityTimestamp: {
    fontSize: 12, // Reduced font size
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 4,
  },
  contentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12, // Standardized radius
    padding: 8,
  },
  contentThumbnail: {
    width: 36, // Reduced size
    height: 36, // Reduced size
    borderRadius: 6, // Adjusted radius
    marginRight: 10, // Reduced margin
  },
  contentTitle: {
    flex: 1,
    fontSize: 13, // Reduced font size
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    lineHeight: 17, // Adjusted line height
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1DA1F2',
    marginLeft: 8,
    alignSelf: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});