import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MessageCircle, 
  Heart, 
  Share, 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Award, 
  BookOpen, 
  Zap,
  Plus,
  X,
  Send
} from 'lucide-react-native';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
    isVerified: boolean;
    level: number;
  };
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags: string[];
  hasMedia?: boolean;
  mediaUrl?: string;
}

interface StudyGroup {
  id: string;
  name: string;
  category: string;
  members: number;
  thumbnail: string;
  description: string;
  isJoined: boolean;
  activity: string;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      title: 'ML Eng.', // Shortened title
      isVerified: true,
      level: 8,
    },
    content: 'Just completed the Neural Networks certification! The hands-on projects really helped solidify the concepts. Anyone else working on deep learning fundamentals?',
    category: 'AI & ML',
    timestamp: '2h ago',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    tags: ['neural-networks', 'certification', 'deep-learning'],
    hasMedia: true,
    mediaUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      title: 'FS Dev', // Shortened title
      isVerified: false,
      level: 5,
    },
    content: 'Quick tip: When learning React hooks, start with useState and useEffect. Master these before moving to more complex hooks like useReducer. Practice makes perfect! 🚀',
    category: 'Web Development',
    timestamp: '4h ago',
    likes: 42,
    comments: 15,
    shares: 7,
    isLiked: true,
    tags: ['react', 'hooks', 'javascript', 'tips'],
  },
  {
    id: '3',
    author: {
      name: 'Maya Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      title: 'Data Sci.', // Shortened title
      isVerified: true,
      level: 12,
    },
    content: 'Sharing my data visualization project using Python and Matplotlib. The key is to tell a story with your data, not just display numbers. What visualization libraries do you prefer?',
    category: 'Data Science',
    timestamp: '6h ago',
    likes: 67,
    comments: 23,
    shares: 12,
    isLiked: false,
    tags: ['python', 'matplotlib', 'data-viz', 'project'],
    hasMedia: true,
    mediaUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const mockStudyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'AI/ML Study Circle',
    category: 'AI & ML',
    members: 1247,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'ML concepts, paper reviews, and project collaborations.', // Shortened
    isJoined: true,
    activity: 'Active now',
  },
  {
    id: '2',
    name: 'React Developers Hub',
    category: 'Web Development',
    members: 892,
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Share React projects, get code reviews, and learn together.', // Shortened
    isJoined: false,
    activity: '12 min ago',
  },
  {
    id: '3',
    name: 'Data Science Bootcamp',
    category: 'Data Science',
    members: 634,
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Intensive group for data science fundamentals & advanced techniques.', // Shortened
    isJoined: true,
    activity: '1h ago',
  },
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set(['2']));
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const toggleGroupJoin = (groupId: string) => {
    // Handle group join/leave logic
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      // Add new post logic here
      setNewPostContent('');
      setShowCreatePost(false);
    }
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with fellow learners</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8B5CF6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search discussions, groups..."
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
            onPress={() => setActiveTab('feed')}
          >
            <MessageCircle size={18} color={activeTab === 'feed' ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
              Feed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
            onPress={() => setActiveTab('groups')}
          >
            <Users size={18} color={activeTab === 'groups' ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
              Groups
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' ? (
          <View style={styles.feedContainer}>
            {/* Create Post Button */}
            <TouchableOpacity 
              style={styles.createPostButton}
              onPress={() => setShowCreatePost(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createPostText}>Share your thoughts...</Text>
            </TouchableOpacity>

            {mockPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
                  <View style={styles.authorInfo}>
                    <View style={styles.authorNameContainer}>
                      <Text style={styles.authorName}>{post.author.name}</Text>
                      {post.author.isVerified && (
                        <Award size={16} color="#8B5CF6" />
                      )}
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>L{post.author.level}</Text>
                      </View>
                    </View>
                    <Text style={styles.authorTitle}>{post.author.title}</Text>
                    <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                  </View>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                {post.hasMedia && post.mediaUrl && (
                  <Image source={{ uri: post.mediaUrl }} style={styles.postMedia} />
                )}

                <View style={styles.postTags}>
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                  {post.tags.length > 2 && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>+{post.tags.length - 2} more</Text>
                    </View>
                  )}
                </View>

                <View style={styles.postActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Heart 
                      size={18} // Slightly smaller icon
                      color={likedPosts.has(post.id) ? "#EF4444" : "#666666"} // Adjusted color for unliked
                      fill={likedPosts.has(post.id) ? "#EF4444" : "transparent"}
                    />
                    {/* Text removed */}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={18} color="#666666" />
                    {/* Text removed */}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={18} color="#666666" />
                    {/* Text removed */}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.groupsContainer}>
            <Text style={styles.sectionTitle}>🔥 Popular Study Groups</Text>
            {mockStudyGroups.map((group) => (
              <View key={group.id} style={styles.groupCard}>
                <Image source={{ uri: group.thumbnail }} style={styles.groupThumbnail} />
                <View style={styles.groupInfo}>
                  <View style={styles.groupHeader}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <View style={styles.activityIndicator}>
                      <View style={styles.activityDot} />
                      <Text style={styles.activityText}>{group.activity}</Text>
                    </View>
                  </View>
                  <Text style={styles.groupCategory}>{group.category}</Text>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                  <View style={styles.groupMeta}>
                    <Users size={16} color="#8B5CF6" />
                    <Text style={styles.groupMembers}>{group.members.toLocaleString()} members</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.joinButton, group.isJoined && styles.joinedButton]}
                  onPress={() => toggleGroupJoin(group.id)}
                >
                  <Text style={[styles.joinButtonText, group.isJoined && styles.joinedButtonText]}>
                    {group.isJoined ? 'Joined' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createPostModal}>
            <View style={styles.createPostHeader}>
              <Text style={styles.createPostTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.createPostInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#666666"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity 
              style={[styles.postButton, !newPostContent.trim() && styles.postButtonDisabled]}
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
            >
              <Send size={22} color={newPostContent.trim() ? "#FFFFFF" : "rgba(102, 102, 102, 0.8)"} />
              {/* Text "Post" removed for a simpler, icon-only button */}
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
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#A78BFA',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    color: '#666666',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  feedContainer: {
    paddingVertical: 20,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  createPostText: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  postCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  authorTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B5CF6',
    marginBottom: 2,
  },
  postTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  postContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 12,
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14, // Kept for potential future use but not active with current changes
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
    marginLeft: 6,
  },
  likedText: { // Kept for potential future use
    color: '#EF4444',
  },
  groupsContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18, // Standardized size
    fontFamily: 'Poppins-SemiBold', // Standardized font
    color: '#FFFFFF',
    marginBottom: 20,
  },
  groupCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222222',
    alignItems: 'center',
  },
  groupThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    flex: 1,
  },
  activityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  activityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
  groupCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 8,
    lineHeight: 20, // Max 2 lines approx with this lineHeight
    maxHeight: 40, // Explicitly limit height for ~2 lines
    overflow: 'hidden', // Hide overflowing text
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupMembers: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 6,
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinedButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  joinedButtonText: {
    color: '#8B5CF6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  createPostModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  createPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createPostTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  createPostInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 14, // Slightly increased padding for better touch target
    borderRadius: 28, // Adjusted for new padding
  },
  postButtonDisabled: {
    backgroundColor: 'rgba(51, 51, 51, 0.7)', // More visually distinct disabled state
  },
  postButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    // marginLeft: 8, // No longer needed as text is removed
  },
  postButtonTextDisabled: {
    color: 'rgba(102, 102, 102, 0.8)',
  },
});