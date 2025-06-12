import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Video, Upload, Image as ImageIcon, Plus, X, Hash, Crown, Sparkles, CircleCheck as CheckCircle, Play } from 'lucide-react-native';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  { id: '1', name: 'AI & ML', icon: '🤖', color: '#8B5CF6' },
  { id: '2', name: 'Web Dev', icon: '💻', color: '#3B82F6' },
  { id: '3', name: 'Mobile', icon: '📱', color: '#10B981' },
  { id: '4', name: 'Data Science', icon: '📊', color: '#F59E0B' },
  { id: '5', name: 'Design', icon: '🎨', color: '#EF4444' },
  { id: '6', name: 'DevOps', icon: '⚙️', color: '#6B7280' },
  { id: '7', name: 'Backend', icon: '🔧', color: '#EC4899' },
  { id: '8', name: 'Frontend', icon: '🎯', color: '#14B8A6' },
];

const difficulties = [
  { id: 'beginner', name: 'Beginner', color: '#10B981' },
  { id: 'intermediate', name: 'Intermediate', color: '#F59E0B' },
  { id: 'advanced', name: 'Advanced', color: '#EF4444' },
];

export default function CreateScreen() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleCameraPress = () => {
    const sampleVideos = [
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    ];
    
    const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    setSelectedMedia(randomVideo);
    
    Alert.alert('Video Recorded', 'Your video has been recorded successfully!');
  };

  const handleGalleryPress = () => {
    const sampleVideos = [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    ];
    
    const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    setSelectedMedia(randomVideo);
    
    Alert.alert('Video Selected', 'Video imported from gallery!');
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 10) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please add a title for your video');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category for your video');
      return;
    }

    if (!selectedDifficulty) {
      Alert.alert('Missing Difficulty', 'Please select a difficulty level');
      return;
    }

    if (!selectedMedia) {
      Alert.alert('Missing Media', 'Please select a video to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          setUploadComplete(true);
          
          setTimeout(() => {
            setUploadComplete(false);
            setTitle('');
            setDescription('');
            setSelectedCategory(null);
            setSelectedDifficulty(null);
            setTags([]);
            setSelectedMedia(null);
            setIsPremium(false);
            setUploadProgress(0);
          }, 2000);
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  if (uploadComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successCircle}
          >
            <CheckCircle size={60} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.successTitle}>Upload Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your video is now live and ready to inspire learners worldwide
          </Text>
          <View style={styles.successStats}>
            <View style={styles.successStat}>
              <Text style={styles.successStatNumber}>🎉</Text>
              <Text style={styles.successStatLabel}>Published</Text>
            </View>
            <View style={styles.successStat}>
              <Text style={styles.successStatNumber}>+50</Text>
              <Text style={styles.successStatLabel}>Points Earned</Text>
            </View>
            <View style={styles.successStat}>
              <Text style={styles.successStatNumber}>📈</Text>
              <Text style={styles.successStatLabel}>Trending</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Create</Text>
        <Text style={styles.headerSubtitle}>Share your knowledge with the world</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Media</Text>
          
          {!selectedMedia ? (
            <View style={styles.mediaUploadContainer}>
              <TouchableOpacity 
                style={styles.mediaUploadButton}
                onPress={handleCameraPress}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.mediaUploadGradient}
                >
                  <Camera size={40} color="#FFFFFF" />
                  <Text style={styles.mediaUploadText}>Record Video</Text>
                  <Text style={styles.mediaUploadSubtext}>Tap to start recording</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.uploadOptions}>
                <TouchableOpacity 
                  style={styles.uploadOption}
                  onPress={handleGalleryPress}
                >
                  <Video size={24} color="#FFFFFF" />
                  <Text style={styles.uploadOptionText}>Upload Video</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.uploadOption}
                  onPress={handleGalleryPress}
                >
                  <ImageIcon size={24} color="#FFFFFF" />
                  <Text style={styles.uploadOptionText}>Add Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.selectedMediaContainer}>
              <Image 
                source={{ uri: selectedMedia }} 
                style={styles.selectedMedia} 
              />
              <View style={styles.mediaOverlay}>
                <Play size={40} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <TouchableOpacity 
                style={styles.removeMediaButton}
                onPress={() => setSelectedMedia(null)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaInfoText}>Video ready for upload</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Give your video a catchy title..."
              placeholderTextColor="#666666"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe what viewers will learn..."
              placeholderTextColor="#666666"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.categoryItemSelected,
                  { borderColor: selectedCategory === category.id ? category.color : '#333333' }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && { color: category.color }
                ]}>
                  {category.name}
                </Text>
                {selectedCategory === category.id && (
                  <View style={[styles.categoryCheck, { backgroundColor: category.color }]}>
                    <CheckCircle size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty Level *</Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty.id}
                style={[
                  styles.difficultyItem,
                  selectedDifficulty === difficulty.id && styles.difficultyItemSelected,
                  { borderColor: selectedDifficulty === difficulty.id ? difficulty.color : '#333333' }
                ]}
                onPress={() => setSelectedDifficulty(difficulty.id)}
              >
                <Text style={[
                  styles.difficultyName,
                  selectedDifficulty === difficulty.id && { color: difficulty.color }
                ]}>
                  {difficulty.name}
                </Text>
                {selectedDifficulty === difficulty.id && (
                  <View style={[styles.difficultyCheck, { backgroundColor: difficulty.color }]}>
                    <CheckCircle size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Add up to 10 tags to help people discover your content</Text>
          
          <View style={styles.tagInputContainer}>
            <Hash size={20} color="#666666" />
            <TextInput
              style={styles.tagInput}
              placeholder="Add tags (press Enter to add)"
              placeholderTextColor="#666666"
              value={currentTag}
              onChangeText={setCurrentTag}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              maxLength={20}
            />
            <TouchableOpacity 
              style={[styles.addTagButton, currentTag.trim() && styles.addTagButtonActive]}
              onPress={handleAddTag}
              disabled={!currentTag.trim() || tags.length >= 10}
            >
              <Plus size={20} color={currentTag.trim() && tags.length < 10 ? "#FFFFFF" : "#666666"} />
            </TouchableOpacity>
          </View>

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          <Text style={styles.tagCount}>{tags.length}/10 tags</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.premiumToggle}
            onPress={() => setIsPremium(!isPremium)}
          >
            <View style={styles.premiumToggleLeft}>
              <Crown size={24} color="#FFD700" />
              <View style={styles.premiumToggleText}>
                <Text style={styles.premiumToggleTitle}>Premium Content</Text>
                <Text style={styles.premiumToggleSubtitle}>
                  Restrict access to premium subscribers only
                </Text>
              </View>
            </View>
            <View style={[styles.toggleSwitch, isPremium && styles.toggleSwitchActive]}>
              <View style={[styles.toggleKnob, isPremium && styles.toggleKnobActive]} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.uploadButton, 
            (isUploading || !title.trim() || !selectedCategory || !selectedDifficulty || !selectedMedia) && styles.uploadButtonDisabled
          ]}
          onPress={handleUpload}
          disabled={isUploading || !title.trim() || !selectedCategory || !selectedDifficulty || !selectedMedia}
        >
          <LinearGradient
            colors={
              isUploading || !title.trim() || !selectedCategory || !selectedDifficulty || !selectedMedia 
                ? ['#666666', '#444444'] 
                : ['#8B5CF6', '#7C3AED']
            }
            style={styles.uploadButtonGradient}
          >
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <Upload size={20} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Uploading... {Math.round(uploadProgress)}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
              </View>
            ) : (
              <>
                <Sparkles size={20} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Share with Community</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

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
    color: '#CCCCCC',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold', // Standardized font
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 16,
  },
  mediaUploadContainer: {
    alignItems: 'center',
  },
  mediaUploadButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    width: '100%',
  },
  mediaUploadGradient: {
    paddingVertical: 30, // Reduced padding
    paddingHorizontal: 40,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    borderStyle: 'dashed',
  },
  mediaUploadText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16, // Reduced font size
    marginTop: 12,
  },
  mediaUploadSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    fontSize: 13, // Reduced font size
    marginTop: 4,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  uploadOption: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12, // Standardized radius
    borderWidth: 1,
    borderColor: '#333333',
    minWidth: 120,
  },
  uploadOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 13, // Reduced font size
    marginTop: 8,
  },
  selectedMediaContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedMedia: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  mediaOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mediaInfoText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 11, // Reduced font size
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14, // Reduced font size
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 11, // Reduced font size
    textAlign: 'right',
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12, // Standardized radius
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    fontSize: 20, // Reduced icon size
    marginBottom: 8,
  },
  categoryName: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 13, // Reduced font size
  },
  categoryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyItem: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12, // Standardized radius
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
  },
  difficultyItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyName: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 13, // Reduced font size
  },
  difficultyCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: 14, // Reduced font size
    paddingVertical: 10, // Adjusted padding
    marginLeft: 8,
  },
  addTagButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12, // Standardized radius
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 13, // Reduced font size
    marginRight: 6,
  },
  tagCount: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 11, // Reduced font size
    textAlign: 'right',
  },
  premiumToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  premiumToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumToggleText: {
    marginLeft: 12,
    flex: 1,
  },
  premiumToggleTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15, // Reduced font size
    marginBottom: 2,
  },
  premiumToggleSubtitle: {
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    fontSize: 13, // Reduced font size
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333333',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#8B5CF6',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  uploadButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 16, // Reduced font size
    marginLeft: 8,
  },
  uploadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24, // Reduced font size
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 14, // Reduced font size
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22, // Adjusted line height
    marginBottom: 40,
  },
  successStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  successStat: {
    alignItems: 'center',
  },
  successStatNumber: {
    fontSize: 28, // Reduced font size
    marginBottom: 8,
  },
  successStatLabel: {
    fontSize: 13, // Reduced font size
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
  },
  bottomSpacing: {
    height: 100,
  },
});