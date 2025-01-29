import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Image,
  TouchableOpacity, Alert, TextInput, Modal, Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../assets/common/baseurl';
import AuthGlobal from '../Context/Store/AuthGlobal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, Provider } from 'react-native-paper';
import Swiper from "react-native-swiper";
import { filterBadWords } from './filteredwords'; // Adjust the path as necessary
import CreatePost from '../screens/Post/createPost';

const LandingPage = ({ navigation }) => {
  const context = useContext(AuthGlobal);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [images, setImages] = useState([]);
  const isAdmin = context?.user?.role === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredForums, setFilteredForums] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      const storedToken = await AsyncStorage.getItem('jwt');
      setToken(storedToken);
      try {
        const response = await fetch(`${baseURL}posts`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        // Find the posts with the maximum likes
        const maxLikes = Math.max(...data.map(post => post.likes));
        const topLikedPosts = data.filter(post => post.likes === maxLikes);

        // Sort posts by createdAt and bring top liked posts to the front
        const sortedPosts = [
          ...topLikedPosts,
          ...data.filter(post => post.likes !== maxLikes)
        ].sort((b, a) => new Date(b.createdAt) - new Date(a.createdAt));

        setForums(sortedPosts);

        // Collect all images from the posts for the carousel
        const allImages = data.flatMap(post => post.images || []);
        setImages(allImages); // Set images for the carousel
      } catch (error) {
        setError('Error fetching forums');
      } finally {
        setLoading(false);
      }
    };
    fetchForums();
  }, [refresh]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = forums.filter(forum => {
      const userName = forum.user?.name?.toLowerCase() || '';
      const title = forum.title?.toLowerCase() || '';
      const content = forum.content?.toLowerCase() || '';
      const searchText = text.toLowerCase();

      return userName.includes(searchText) ||
        title.includes(searchText) ||
        content.includes(searchText);
    });
    setFilteredForums(filtered);
  };


  const triggerRefresh = () => setRefresh(!refresh);

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`${baseURL}posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        setForums(prevForums =>
          prevForums.map(forum =>
            forum._id === postId
              ? { ...forum, likes: data.likes, likedBy: data.likedBy }
              : forum
          )
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Could not like the post.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not like the post.');
    }
  };


  const handleAddComment = async (postId) => {
    const filteredComment = filterBadWords(comment); // Filter the comment

    if (filteredComment !== comment) { // If the comment was modified
      setComment(filteredComment); // Update the comment to the filtered version
      return; // Stop submission as the comment has been filtered
    }

    try {
      const response = await fetch(`${baseURL}posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        setComment('');
        triggerRefresh();
      }
    } catch {
      Alert.alert('Error', 'Could not add comment.');
    }
  };

  const handleAddReply = async () => {
    if (!reply) return Alert.alert('Error', 'Reply cannot be empty');

    const filteredReply = filterBadWords(reply); // Filter the reply

    if (filteredReply !== reply) { // If the reply was modified
      setReply(filteredReply); // Update the reply to the filtered version
      return; // Stop submission as the reply has been filtered
    }

    try {
      const response = await fetch(`${baseURL}posts/${selectedPostId}/comments/${selectedCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: reply }),
      });

      if (response.ok) {
        setReply('');
        setShowReplyModal(false);
        triggerRefresh();
      }
    } catch {
      Alert.alert('Error', 'Could not add reply.');
    }
  };


  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const
    handleEditComment = (postId, commentId, currentContent) => {
      console.log('Before navigation:', { commentId, currentContent, postId });
      navigation.navigate('UpdateComment', {
        postId: postId,
        commentId: commentId,  // Correcting to use commentId
        currentContent: currentContent
      });
    };


  const approvedForums = forums.filter(post => post.status === "Approved");
  const renderForumItem = ({ item }) => {
    const isTopPost = item.likes === Math.max(...forums.map(post => post.likes));
    return (
      <View style={[styles.forumCard, isTopPost && styles.topPostCard]}>
        {isTopPost && <Text style={styles.topPostLabel}>Trending Post</Text>}
        <View style={styles.userContainer}>
          {item.user?.image ? (
            <Image source={{ uri: item.user.image }} style={styles.userImage} />
          ) : (
            <Text>No profile image</Text>
          )}
          <Text style={styles.forumUser}>{item.user?.name || 'Unknown'}</Text>
        </View>
        <Text style={styles.forumDate}>{new Date(item.createdAt).toLocaleString()}</Text>
        <Text style={styles.forumTitle}>{item.title}</Text>
        <Text style={styles.forumContent}>{item.content}</Text>

        {/* Carousel for images */}
        {item.images && item.images.length > 0 && (
          <View style={{ flex: 1 }}>
            <Swiper
              style={{ height: 200 }} // Adjust height
              showsButtons={false}
              paginationStyle={{ bottom: 10 }} // Adjust pagination position
              autoplay
              autoplayTimeout={10}
            >
              {item.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{
                    width: '100%',
                    height: 200, // Adjust as needed
                    margin: 0,
                    padding: 0,
                    resizeMode: 'cover',
                  }}
                />
              ))}
            </Swiper>
          </View>
        )}


        {/* Likes and comments section */}
        <View style={styles.likesCommentsContainer}>
          <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(item._id)}>
            <Icon name="thumbs-up" size={16} color="#007AFF" style={styles.likeIcon} />
            <Text style={styles.likesText}>{item.likes} Likes</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.commentCountText}>{item.comments.length} Comments</Text>
        </View>

        {/* Comment section */}
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments:</Text>
          {item.comments.map((comment, index) => {
            if (!expandedComments[item._id] && index >= 1) return null;
            return (
              <View key={comment._id} style={styles.comment}>
                {comment.user?.image && (
                  <Image source={{ uri: comment.user.image }} style={styles.commentUserImage} />
                )}
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUser}>{comment.user?.name || 'Anonymous'}</Text>
                  <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>

                  {/* Menu for comment actions */}
                  <Menu
                    visible={comment.showMenu}
                    onDismiss={() => handleMenuDismiss(comment._id)}
                    anchor={<TouchableOpacity onPress={() => handleMenuPress(comment._id)}><Icon name="ellipsis-v" size={20} color="#888" /></TouchableOpacity>}
                  >
                    <Menu.Item onPress={() => handleEditComment(item._id, comment._id, comment.content)} title="Edit Comment" />
                    <Menu.Item onPress={() => handleDeleteComment(item._id, comment._id)} title="Delete Comment" />
                  </Menu>

                  {/* Reply section */}
                  <TouchableOpacity onPress={() => setSelectedPostId(item._id) || setSelectedCommentId(comment._id) || setShowReplyModal(true)}>
                    <Text style={styles.replyLink}>Reply</Text>
                  </TouchableOpacity>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                      {comment.replies.slice(0, expandedReplies[comment._id] ? comment.replies.length : 1).map(reply => (
                        <View key={reply._id} style={styles.reply}>
                          {reply.user?.image && (
                            <Image source={{ uri: reply.user.image }} style={styles.replyUserImage} />
                          )}
                          <View style={styles.replyTextContainer}>
                            <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}</Text>
                            <Text style={styles.replyDate}>{new Date(reply.createdAt).toLocaleString()}</Text>
                            <Text style={styles.replyContent}>{reply.content}</Text>

                            {/* Ellipsis menu for reply */}
                            <Menu
                              visible={reply.showMenu}
                              onDismiss={() => handleReplyMenuDismiss(reply._id)}
                              anchor={
                                <TouchableOpacity onPress={() => handleReplyMenuPress(reply._id)}>
                                  <Icon name="ellipsis-v" size={20} color="#888" />
                                </TouchableOpacity>
                              }
                            >
                              <Menu.Item onPress={() => handleEditReply(item._id, comment._id, reply._id, reply.content)} title="Edit Reply" />
                              <Menu.Item onPress={() => handleDeleteReply(item._id, comment._id, reply._id)} title="Delete Reply" />
                            </Menu>
                          </View>
                        </View>
                      ))}
                      <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                        <Text style={styles.replyButton}>{expandedReplies[comment._id] ? 'Hide Replies' : 'Show More Replies'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        {item.comments.length > 2 && (
          <TouchableOpacity onPress={() => toggleComments(item._id)}>
            <Text style={styles.replyButton}>{expandedComments[item._id] ? 'See Less Comments' : 'See More Comments'}</Text>
          </TouchableOpacity>
        )}

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
          />
          <Button title="Comment" onPress={() => handleAddComment(item._id)} />
        </View>
      </View>
    );
  };


  const handleReplyMenuPress = (replyId) => {
    const updatedForums = forums.map(forum => ({
      ...forum,
      comments: forum.comments.map(comment => ({
        ...comment,
        replies: comment.replies.map(reply => {
          if (reply._id === replyId) {
            return { ...reply, showMenu: !reply.showMenu };
          }
          return reply;
        }),
      })),
    }));
    setForums(updatedForums);
  };

  const handleReplyMenuDismiss = (replyId) => {
    const updatedForums = forums.map(forum => ({
      ...forum,
      comments: forum.comments.map(comment => ({
        ...comment,
        replies: comment.replies.map(reply => {
          if (reply._id === replyId) {
            return { ...reply, showMenu: false };
          }
          return reply;
        }),
      })),
    }));
    setForums(updatedForums);
  };

  const handleEditReply = (postId, commentId, replyId, currentContent) => {
    navigation.navigate('UpdateReply', {
      postId,
      commentId,
      replyId,
      currentContent
    });
  };

  // Handle delete reply
  const handleDeleteReply = async (postId, commentId, replyId) => {
    try {
      const response = await fetch(`${baseURL}posts/${postId}/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        triggerRefresh(); // Refresh after successful deletion
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Could not delete the reply.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not delete the reply.');
    }
  };

  const handleMenuPress = (commentId) => {
    const updatedComments = forums.map(forum => {
      return {
        ...forum,
        comments: forum.comments.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, showMenu: !comment.showMenu };
          }
          return comment;
        }),
      };
    });
    setForums(updatedComments);
  };

  const handleMenuDismiss = (commentId) => {
    const updatedComments = forums.map(forum => {
      return {
        ...forum,
        comments: forum.comments.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, showMenu: false };
          }
          return comment;
        }),
      };
    });
    setForums(updatedComments);
  };

  const handleDeleteComment = (postId, commentId) => {
    Alert.alert('Delete Comment', `Are you sure you want to delete this comment?`, [
      { text: 'Cancel' },
      { text: 'Yes', onPress: () => deleteComment(postId, commentId) },
    ]);
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const response = await fetch(`${baseURL}posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        triggerRefresh(); // Successfully deleted, refresh the comments
      } else {
        const errorData = await response.json(); // Get additional error details from backend
        console.error('Delete failed:', errorData); // Log error data for troubleshooting
        Alert.alert('Error', errorData.message || 'Could not delete the comment.');
      }
    } catch (error) {
      console.error('Delete request error:', error);
      Alert.alert('Error', 'Could not delete the comment. Please try again.');
    }
  };


  return (
    loading ? <ActivityIndicator size="large" color="#0000ff" /> :
      error ? <Text>{error}</Text> :
        <Provider>
          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search posts..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => handleSearch(searchQuery)}
              >
                <Icon name="search" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
             data={searchQuery ? filteredForums.filter(post => post.status === "Approved") : forums.filter(post => post.status === "Approved")}
              renderItem={renderForumItem}
              keyExtractor={(item) => item._id}
              onRefresh={triggerRefresh}
              refreshing={loading}
            />
            <Modal visible={showReplyModal} animationType="slide">
              <View style={styles.modalContainer}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Write a reply..."
                  value={reply}
                  onChangeText={setReply}
                />
                <Button title="Send Reply" onPress={handleAddReply} />
                <Button title="Close" onPress={() => setShowReplyModal(false)} />
              </View>
            </Modal>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Provider>
  );

};
const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    margin: 0, // Ensure no margins are set
    padding: 0, // Ensures no overflow
  },

  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
    margin: 0, // Remove default margins
    padding: 0, // Remove padding
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10, // Adjust as needed
    alignSelf: 'center',
  },

  likesCommentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  likeIcon: {
    marginRight: 5,
  },
  likesText: {
    fontSize: 14,
    color: '#fff',
  },
  divider: {
    width: 1,
    height: 15,
    backgroundColor: '#ccc',
    marginHorizontal: 60,
  },
  commentCountText: {
    fontSize: 14,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  forumCard: {
    borderRadius: 20,
    padding: 13,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5,
  },
  forumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    position: 'relative', // Ensure the user container is relative for label positioning
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    zIndex: 0, // Ensure the profile image stays in the background
  },
  forumUser: {
    fontSize: 17,
  },
  forumDate: {
    fontSize: 12,
    color: '#888',
  },
  forumContent: {
    fontSize: 17,
    marginVertical: 10,
  },
  likesContainer: {
    marginBottom: 5,
  },
  likesText: {
    color: '#007bff',
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  comment: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 13,
    color: '#888',
  },
  commentContent: {
    fontSize: 14,
  },
  repliesContainer: {
    marginLeft: 40,
  },
  reply: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  replyUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  replyTextContainer: {
    flex: 1,
  },
  replyUser: {
    fontWeight: 'bold',
  },
  replyDate: {
    fontSize: 12,
    color: '#888',
  },
  replyContent: {
    fontSize: 14,
  },
  replyButton: {
    color: '#007bff',
    marginTop: 5,
  },
  replyLink: {
    color: '#007bff',
    marginTop: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  topPostCard: {
    borderColor: '#FFD700',  // Gold border for top post
    borderWidth: 2,
    backgroundColor: '#FFFFFF',  // Light yellow background
    marginTop: 20,
  },
  topPostLabel: {
    position: 'absolute',
    top: -15, // Adjust to be just above the profile image
    left: 10,
    backgroundColor: '#FFD700',
    color: '#000',
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 5,
    zIndex: 1, // Ensure label is above the image
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 25,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  }
});


export default LandingPage;
