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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Clock, CheckCircle, Lock, Star, Trophy, Download, Share, Calendar, Users } from 'lucide-react-native';

interface Certificate {
  id: string;
  title: string;
  category: string;
  issuer: string;
  dateEarned?: string;
  validUntil?: string;
  credentialId?: string;
  status: 'earned' | 'in-progress' | 'available' | 'locked';
  progress?: number;
  requirements: {
    videosCompleted: number;
    totalVideos: number;
    quizzesPassed: number;
    totalQuizzes: number;
    projectsSubmitted: number;
    totalProjects: number;
  };
  thumbnail: string;
  isPremium: boolean;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  recognizedBy: string[];
}

const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals',
    category: 'AI & ML',
    issuer: 'Edugram Academy',
    dateEarned: '2024-01-15',
    validUntil: '2026-01-15',
    credentialId: 'EDG-ML-2024-001',
    status: 'earned',
    progress: 100,
    requirements: {
      videosCompleted: 12,
      totalVideos: 12,
      quizzesPassed: 8,
      totalQuizzes: 8,
      projectsSubmitted: 3,
      totalProjects: 3,
    },
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPremium: false,
    estimatedTime: '40 hours',
    difficulty: 'Beginner',
    recognizedBy: ['Google', 'Microsoft', 'IBM'],
  },
  {
    id: '2',
    title: 'Advanced Neural Networks',
    category: 'AI & ML',
    issuer: 'Edugram Academy',
    status: 'in-progress',
    progress: 65,
    requirements: {
      videosCompleted: 8,
      totalVideos: 15,
      quizzesPassed: 5,
      totalQuizzes: 10,
      projectsSubmitted: 1,
      totalProjects: 4,
    },
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPremium: true,
    estimatedTime: '60 hours',
    difficulty: 'Advanced',
    recognizedBy: ['NVIDIA', 'OpenAI', 'DeepMind'],
  },
  {
    id: '3',
    title: 'Full-Stack Web Development',
    category: 'Web Development',
    issuer: 'Edugram Academy',
    status: 'available',
    progress: 0,
    requirements: {
      videosCompleted: 0,
      totalVideos: 25,
      quizzesPassed: 0,
      totalQuizzes: 15,
      projectsSubmitted: 0,
      totalProjects: 5,
    },
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPremium: false,
    estimatedTime: '80 hours',
    difficulty: 'Intermediate',
    recognizedBy: ['Meta', 'Netflix', 'Airbnb'],
  },
  {
    id: '4',
    title: 'Data Science Professional',
    category: 'Data Science',
    issuer: 'Edugram Academy',
    status: 'locked',
    progress: 0,
    requirements: {
      videosCompleted: 0,
      totalVideos: 30,
      quizzesPassed: 0,
      totalQuizzes: 20,
      projectsSubmitted: 0,
      totalProjects: 6,
    },
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPremium: true,
    estimatedTime: '100 hours',
    difficulty: 'Advanced',
    recognizedBy: ['Amazon', 'Tesla', 'Spotify'],
  },
];

export default function CertificationsScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'earned' | 'progress'>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredCertificates = mockCertificates.filter(cert => {
    switch (selectedTab) {
      case 'earned':
        return cert.status === 'earned';
      case 'progress':
        return cert.status === 'in-progress';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'earned': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'available': return '#8B5CF6';
      case 'locked': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'earned': return <CheckCircle size={20} color="#10B981" />;
      case 'in-progress': return <Clock size={20} color="#F59E0B" />;
      case 'available': return <Award size={20} color="#8B5CF6" />;
      case 'locked': return <Lock size={20} color="#6B7280" />;
      default: return <Award size={20} color="#6B7280" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleCertificatePress = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Certifications</Text>
        <Text style={styles.headerSubtitle}>Earn industry-recognized credentials</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'earned' && styles.activeTab]}
            onPress={() => setSelectedTab('earned')}
          >
            <Text style={[styles.tabText, selectedTab === 'earned' && styles.activeTabText]}>
              Earned
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'progress' && styles.activeTab]}
            onPress={() => setSelectedTab('progress')}
          >
            <Text style={[styles.tabText, selectedTab === 'progress' && styles.activeTabText]}>
              In Progress
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#FFD700" />
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>450</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.certificatesContainer}>
          {filteredCertificates.map((certificate) => (
            <TouchableOpacity
              key={certificate.id}
              style={styles.certificateCard}
              onPress={() => handleCertificatePress(certificate)}
            >
              <Image source={{ uri: certificate.thumbnail }} style={styles.certificateThumbnail} />
              
              <View style={styles.certificateInfo}>
                <View style={styles.certificateHeader}>
                  <Text style={styles.certificateTitle}>{certificate.title}</Text>
                  {getStatusIcon(certificate.status)}
                </View>
                
                <Text style={styles.certificateCategory}>{certificate.category}</Text>
                <Text style={styles.certificateIssuer}>by {certificate.issuer}</Text>
                
                {certificate.status === 'in-progress' && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[styles.progressFill, { width: `${certificate.progress}%` }]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{certificate.progress}% complete</Text>
                  </View>
                )}
                
                {certificate.status === 'earned' && certificate.dateEarned && (
                  <View style={styles.earnedInfo}>
                    <Calendar size={16} color="#10B981" />
                    <Text style={styles.earnedDate}>Earned {certificate.dateEarned}</Text>
                  </View>
                )}
                
                <View style={styles.certificateMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color="#8B5CF6" />
                    <Text style={styles.metaText}>{certificate.estimatedTime}</Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(certificate.difficulty) }]}>
                    <Text style={styles.difficultyText}>{certificate.difficulty}</Text>
                  </View>
                </View>
              </View>
              
              {certificate.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PRO</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Certificate Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCertificate && (
              <>
                <View style={styles.modalHeader}>
                  <Image source={{ uri: selectedCertificate.thumbnail }} style={styles.modalThumbnail} />
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalTitle}>{selectedCertificate.title}</Text>
                    <Text style={styles.modalCategory}>{selectedCertificate.category}</Text>
                    <View style={styles.modalStatus}>
                      {getStatusIcon(selectedCertificate.status)}
                      <Text style={[styles.modalStatusText, { color: getStatusColor(selectedCertificate.status) }]}>
                        {selectedCertificate.status.charAt(0).toUpperCase() + selectedCertificate.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedCertificate.status === 'earned' && (
                  <View style={styles.credentialInfo}>
                    <Text style={styles.credentialTitle}>Credential Information</Text>
                    <Text style={styles.credentialId}>ID: {selectedCertificate.credentialId}</Text>
                    <Text style={styles.credentialDate}>Valid until: {selectedCertificate.validUntil}</Text>
                  </View>
                )}

                <View style={styles.requirementsSection}>
                  <Text style={styles.sectionTitle}>Requirements</Text>
                  
                  <View style={styles.requirement}>
                    <Text style={styles.requirementLabel}>Video Lessons</Text>
                    <Text style={styles.requirementProgress}>
                      {selectedCertificate.requirements.videosCompleted}/{selectedCertificate.requirements.totalVideos}
                    </Text>
                  </View>
                  
                  <View style={styles.requirement}>
                    <Text style={styles.requirementLabel}>Quizzes Passed</Text>
                    <Text style={styles.requirementProgress}>
                      {selectedCertificate.requirements.quizzesPassed}/{selectedCertificate.requirements.totalQuizzes}
                    </Text>
                  </View>
                  
                  <View style={styles.requirement}>
                    <Text style={styles.requirementLabel}>Projects Submitted</Text>
                    <Text style={styles.requirementProgress}>
                      {selectedCertificate.requirements.projectsSubmitted}/{selectedCertificate.requirements.totalProjects}
                    </Text>
                  </View>
                </View>

                <View style={styles.recognitionSection}>
                  <Text style={styles.sectionTitle}>Recognized By</Text>
                  <View style={styles.recognizedByContainer}>
                    {selectedCertificate.recognizedBy.map((company, index) => (
                      <View key={index} style={styles.companyBadge}>
                        <Text style={styles.companyText}>{company}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {selectedCertificate.status === 'earned' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Download size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Share size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowDetailModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
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
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#222222',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  certificatesContainer: {
    paddingBottom: 20,
  },
  certificateCard: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#222222',
    position: 'relative',
  },
  certificateThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  certificateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  certificateCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  certificateIssuer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  earnedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  earnedDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 6,
  },
  certificateMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  premiumText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  modalThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  modalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  credentialInfo: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  credentialTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 8,
  },
  credentialId: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  credentialDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  requirementsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  requirement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  requirementLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  requirementProgress: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  recognitionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recognizedByContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  companyBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  companyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
});