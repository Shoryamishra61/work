import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, TrendingUp, Clock, Users, Star, Play, Crown, Filter } from 'lucide-react-native';

interface TrendingVideo {
  id: string;
  title: string;
  thumbnail: string;
  creator: string;
  views: string;
  duration: string;
  category: string;
  isPremium: boolean;
  difficulty: string;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  specialization: string;
  verified: boolean;
}

const categories = [
  'All', 'AI & ML', 'Web Dev', 'Mobile', 'Data Science', 'DevOps', 'Design', 'Business'
];

const mockTrendingVideos: TrendingVideo[] = [
  {
    id: '1',
    title: 'ChatGPT API Integration',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    creator: 'TechGuru',
    views: '125K',
    duration: '2:45',
    category: 'AI & ML',
    isPremium: false,
    difficulty: 'Intermediate',
  },
  {
    id: '2',
    title: 'React Native Performance',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    creator: 'CodeMaster',
    views: '89K',
    duration: '3:12',
    category: 'Mobile',
    isPremium: true,
    difficulty: 'Advanced',
  },
  {
    id: '3',
    title: 'Python Data Analysis',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
    creator: 'DataScientist',
    views: '67K',
    duration: '4:30',
    category: 'Data Science',
    isPremium: false,
    difficulty: 'Beginner',
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
    creator: 'DesignPro',
    views: '234K',
    duration: '1:58',
    category: 'Design',
    isPremium: true,
    difficulty: 'Intermediate',
  },
  {
    id: '5',
    title: 'Docker Fundamentals',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    creator: 'DevOpsGuru',
    views: '156K',
    duration: '5:15',
    category: 'DevOps',
    isPremium: false,
    difficulty: 'Beginner',
  },
  {
    id: '6',
    title: 'Advanced JavaScript',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    creator: 'JSExpert',
    views: '78K',
    duration: '3:42',
    category: 'Web Dev',
    isPremium: false,
    difficulty: 'Advanced',
  },
];

const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: '125K',
    specialization: 'Machine Learning',
    verified: true,
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: '89K',
    specialization: 'Web Development',
    verified: false,
  },
  {
    id: '3',
    name: 'Maya Patel',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: '67K',
    specialization: 'Data Science',
    verified: true,
  },
  {
    id: '4',
    name: 'CodeMaster Pro',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    followers: '234K',
    specialization: 'Full Stack Development',
    verified: true,
  },
];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'videos' | 'creators'>('videos');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderVideoItem = ({ item }: { item: TrendingVideo }) => (
    <TouchableOpacity style={styles.videoItem}>
      <View style={styles.videoThumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
        <View style={styles.videoOverlay}>
          <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
        </View>
        <View style={styles.videoDuration}>
          <Text style={styles.videoDurationText}>{item.duration}</Text>
        </View>
        {item.isPremium && (
          <View style={styles.videoPremiumBadge}>
            <Crown size={12} color="#FFD700" />
          </View>
        )}
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoCreator}>{item.creator}</Text>
        <View style={styles.videoStats}>
          <Text style={styles.videoViews}>{item.views} views</Text>
          <Text style={styles.videoCategory}>• {item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCreatorItem = ({ item }: { item: Creator }) => (
    <TouchableOpacity style={styles.creatorItem}>
      <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
      <View style={styles.creatorInfo}>
        <View style={styles.creatorNameContainer}>
          <Text style={styles.creatorName}>{item.name}</Text>
          {item.verified && (
            <Star size={16} color="#8B5CF6" fill="#8B5CF6" />
          )}
        </View>
        <Text style={styles.creatorSpecialization}>{item.specialization}</Text>
        <Text style={styles.creatorFollowers}>{item.followers} followers</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredVideos = selectedCategory === 'All' 
    ? mockTrendingVideos 
    : mockTrendingVideos.filter(video => video.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Discover</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8B5CF6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search videos, creators..."
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
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <TrendingUp size={18} color={activeTab === 'videos' ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
              Videos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'creators' && styles.activeTab]}
            onPress={() => setActiveTab('creators')}
          >
            <Users size={18} color={activeTab === 'creators' ? '#FFFFFF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'creators' && styles.activeTabText]}>
              Creators
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {activeTab === 'videos' ? (
          <>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
              contentContainerStyle={styles.categoriesContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#FFFFFF" />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>

            <FlatList
              data={filteredVideos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.videoRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.videosList}
            />
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#FFFFFF" />
              <Text style={styles.sectionTitle}>Top Educators</Text>
            </View>

            <FlatList
              data={mockCreators}
              renderItem={renderCreatorItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.creatorsList}
            />
          </>
        )}
      </View>
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
  categoriesContainer: {
    marginVertical: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryText: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  videosList: {
    paddingBottom: 100,
  },
  videoRow: {
    justifyContent: 'space-between',
  },
  videoItem: {
    width: '48%',
    marginBottom: 20,
  },
  videoThumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  videoOverlay: {
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
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  videoPremiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 4,
    borderRadius: 8,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  videoInfo: {
    paddingHorizontal: 4,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  videoCreator: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoViews: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  videoCategory: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  creatorsList: {
    paddingBottom: 100,
  },
  creatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  creatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  creatorName: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginRight: 6,
  },
  creatorSpecialization: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  creatorFollowers: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
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
});