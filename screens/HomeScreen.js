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
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setForums(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        setError('Error fetching forums');
      } finally {
        setLoading(false);
      }
    };
    fetchForums();
  }, [refresh]);

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




  const renderForumItem = ({ item }) => (
    <View style={styles.forumCard}>
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
      {item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.forumImage} />
      )}
      <View style={styles.likesCommentsContainer}>
        <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(item._id)}>
          <Icon name="thumbs-up" size={16} color="#007AFF" style={styles.likeIcon} />
          <Text style={styles.likesText}>{item.likes} Likes</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.commentCountText}>{item.comments.length} Comments</Text>
      </View>
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

                <Menu
                visible={comment.showMenu}
                onDismiss={() => handleMenuDismiss(comment._id)}
                anchor={<TouchableOpacity onPress={() => handleMenuPress(comment._id)}><Icon name="ellipsis-v" size={20} color="#888" /></TouchableOpacity>}
              >
                <Menu.Item onPress={() => handleEditComment(item._id, comment._id, comment.content)} title="Edit Comment" />
                <Menu.Item onPress={() => handleDeleteComment(item._id, comment._id)} title="Delete Comment" />
              </Menu>


                <TouchableOpacity onPress={() => setSelectedPostId(item._id) || setSelectedCommentId(comment._id) || setShowReplyModal(true)}>
                  <Text style={styles.replyLink}>Reply</Text>
                </TouchableOpacity>
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
          <FlatList
            data={forums}
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
        </View>
      </Provider>  
);

};
const styles = StyleSheet.create({
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
    padding: 10,
    backgroundColor:'#E0F8E6'
  },
  forumCard: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white"
  },
  forumTitle: {
    fontSize: 20,
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
