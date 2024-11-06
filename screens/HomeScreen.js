import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert, TextInput, Modal, Button, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../assets/common/baseurl';
import AuthGlobal from '../Context/Store/AuthGlobal';

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

  useEffect(() => {
    const fetchForums = async () => {
      const storedToken = await AsyncStorage.getItem('jwt');
      setToken(storedToken);

      try {
        const response = await fetch(`${baseURL}posts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to fetch forums: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        setForums(data);
      } catch (error) {
        console.error('Error fetching forums:', error);
        setError('Error fetching forums');
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [refresh]); // Refresh whenever `refresh` changes

  // To trigger a refresh, you can call setRefresh(!refresh) whenever you want to re-fetch the data

  const handleLikePost = async (postId) => {
    const storedToken = await AsyncStorage.getItem('jwt');
    try {
      const response = await fetch(`${baseURL}posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to like post: ${response.status} - ${errorMessage}`);
      }

      setForums(prevForums =>
        prevForums.map(forum =>
          forum._id === postId ? { ...forum, likes: forum.likes + 1 } : forum
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Could not like the post.');
    }
  };
  const handleAddComment = async (postId, commentContent) => {
    try {
      const response = await fetch(`${baseURL}posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComment('');

        setForums((prevForums) =>
          prevForums.map((post) =>
            post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post
          )
        );

      } else {
        console.error('Failed to add comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }

  };
  const handleAddReply = async () => {
    if (!reply) {
      Alert.alert('Error', 'Reply cannot be empty');
      return;
    }

    const storedToken = await AsyncStorage.getItem('jwt');

    try {
      const response = await fetch(`${baseURL}posts/${selectedPostId}/comments/${selectedCommentId}/replies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: reply }),
      });

      if (response.ok) {
        const newReply = await response.json();
        setReply('');
        setShowReplyModal(false);

        setForums(prevForums =>
          prevForums.map(forum =>
            forum._id === selectedPostId
              ? {
                ...forum,
                comments: forum.comments.map(comment =>
                  comment._id === selectedCommentId
                    ? {
                      ...comment,
                      replies: [...comment.replies, newReply] // Ensure this is the correct structure
                    }
                    : comment
                )
              }
              : forum
          )
        );
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to add reply: ${response.status} - ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      Alert.alert('Error', error.message || 'Could not add reply.');
    }
  };

  const openReplyModal = (postId, commentId) => {
    setSelectedPostId(postId);
    setSelectedCommentId(commentId);
    setShowReplyModal(true);
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderForumItem = ({ item }) => (
    <View style={styles.forumCard}>
      <View style={styles.userContainer}>
        {item.user?.image ? (
          <Image source={{ uri: item.user.image }} style={styles.userImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>No profile image</Text>
          </View>
        )}
        <Text style={styles.forumUser}>{item.user?.name || 'Unknown'}</Text>
      </View>
      <Text style={styles.forumDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.forumTitle}>{item.title}</Text>
      <Text style={styles.forumContent}>{item.content}</Text>

      {item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.forumImage} resizeMode="cover" />
      ) : (
        <Text style={styles.imagePlaceholder}>No image available</Text>
      )}

      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={() => handleLikePost(item._id)}>
          <Text style={styles.likesText}>{item.likes} {item.likes === 1 ? 'Like' : 'Likes'}</Text>
        </TouchableOpacity>
      </View>

      {/* Render comments and replies */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsHeader}>Comments:</Text>
        {item.comments.length > 0 && item.comments.map((comment, index) => {
          if (!expandedComments[item._id] && index >= 1) return null;

          return (
            <View key={comment._id} style={styles.comment}>
              {comment.user?.image ? (
                <Image source={{ uri: comment.user.image }} style={styles.commentUserImage} />
              ) : (
                <Text style={styles.imagePlaceholder}>No profile image</Text>
              )}
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentUser}>{comment.user?.name || 'Anonymous'}</Text>
                <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>

                <TouchableOpacity onPress={() => openReplyModal(item._id, comment._id)}>
                  <Text style={styles.replyLink}>Reply</Text>
                </TouchableOpacity>

                {/* Show replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {comment.replies.length > 2 ? (
                      <>
                        {expandedReplies[comment._id] ? (
                          <>
                            {comment.replies.map(reply => (
                              <View key={reply._id} style={styles.reply}>
                                {reply.user?.image ? (
                                  <Image source={{ uri: reply.user.image }} style={styles.replyUserImage} />
                                ) : (
                                  <Text style={styles.imagePlaceholder}>No profile image</Text>
                                )}
                                <View style={styles.replyTextContainer}>
                                  <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}</Text>
                                  <Text style={styles.replyDate}>{new Date(reply.createdAt).toLocaleString()}</Text>
                                  <Text style={styles.replyContent}>{reply.content}</Text>
                                </View>
                              </View>
                            ))}

                            <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                              <Text style={styles.replyButton}>Hide Replies</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            {comment.replies.slice(0, 1).map(reply => (
                              <View key={reply._id} style={styles.reply}>
                                {/* User image */}
                                {reply.user?.image ? (
                                  <Image source={{ uri: reply.user.image }} style={styles.replyUserImage} />
                                ) : (
                                  <Text style={styles.imagePlaceholder}>No profile image</Text>
                                )}
                                {/* User name */}
                                <View style={styles.replyTextContainer}>
                                  <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}</Text>
                                  <Text style={styles.replyDate}>{new Date(reply.createdAt).toLocaleString()}</Text>
                                  <Text style={styles.replyContent}>{reply.content}</Text>
                                </View>
                              </View>
                            ))}


                            <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                              <Text style={styles.replyButton}>Show More Replies</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </>
                    ) : (
                      comment.replies.map(reply => (
                        <View key={reply._id} style={styles.reply}>
                          {reply.user?.image ? (
                            <Image source={{ uri: reply.user.image }} style={styles.replyUserImage} />
                          ) : (
                            <Text style={styles.imagePlaceholder}>No profile image</Text>
                          )}
                          <View style={styles.replyTextContainer}>
                            <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}</Text>
                            <Text style={styles.replyDate}>{new Date(reply.createdAt).toLocaleString()}</Text>
                            <Text style={styles.replyContent}>{reply.content}</Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}

              </View>
            </View>
          );
        })}
      </View>

      {/* Toggle See More Comments button */}
      {item.comments.length > 2 && (
        <TouchableOpacity onPress={() => toggleComments(item._id)}>
          <Text style={styles.replyButton}>
            {expandedComments[item._id] ? 'See Less Comments' : 'See More Comments'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button title="Comment" onPress={() => handleAddComment(item._id, comment)} />
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={forums}
        renderItem={renderForumItem}
        keyExtractor={(item) => item._id}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  forumCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  forumTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
  forumImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
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
  imagePlaceholder: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default LandingPage;
