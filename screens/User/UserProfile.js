import React, { useEffect, useState, useContext } from 'react';
import { Modal, View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const UserProfile = ({ navigation }) => {
    const context = useContext(AuthGlobal);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {

        const fetchUserProfile = async () => {
            const storedToken = await AsyncStorage.getItem('jwt');
            const userId = context.stateUser.user?.userId;
            if (userId && storedToken) {
                try {
                    // Fetch user profile details
                    const userProfileResponse = await axios.get(`${baseURL}users/${userId}`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });

                    console.log('User Profile Data:', userProfileResponse.data);

                    setUserInfo(userProfileResponse.data);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        const fetchUserPosts = async () => {
            const storedToken = await AsyncStorage.getItem('jwt');
            try {
                const userId = context.stateUser.user?.userId;
                if (userId && storedToken) {
                    const postsResponse = await axios.get(`${baseURL}posts/user/${userId}`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });
                    setUserPosts(postsResponse.data.posts || postsResponse.data);
                } else {
                    Alert.alert('Error', 'User not authenticated');
                }
            } catch (error) {
                setError('Error fetching user posts');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
        fetchUserPosts();
    }, [refresh]);

    const triggerRefresh = () => setRefresh(!refresh);

    const handleLikePost = async (postId) => {
        try {
            const storedToken = await AsyncStorage.getItem('jwt');
            const response = await fetch(`${baseURL}posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? { ...post, likes: data.likes, likedBy: data.likedBy }
                            : post
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
        if (!comment) return Alert.alert('Error', 'Comment cannot be empty');
        try {
            const storedToken = await AsyncStorage.getItem('jwt');
            const response = await fetch(`${baseURL}posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
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
            const storedToken = await AsyncStorage.getItem('jwt');
            const response = await fetch(`${baseURL}posts/${selectedPostId}/comments/${selectedCommentId}/replies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: reply }),
            });
            if (response.ok) {
                setReply('');
                setShowReplyModal(false);

                // Update the state with new reply
                setExpandedReplies((prev) => ({
                    ...prev,
                    [selectedCommentId]: true, // Auto-expand to show the new reply
                }));

                triggerRefresh();
            }
        } catch {
            Alert.alert('Error', 'Could not add reply.');
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const toggleComments = (postId) => {
        setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };
    
    

    const renderUserInfo = () => {
        console.log('Rendering User Info:', userInfo);
        if (!userInfo) {
            return <Text>Loading user info...</Text>;
        }
        const { _id } = userInfo.user;

        return (
            <View style={styles.userInfoContainer}>
                {userInfo.user?.image ? (
                    <Image source={{ uri: userInfo.user.image }} style={styles.profileImage} />
                ) : (
                    <Text>No profile image</Text>
                )}
                <Text style={styles.userName}>{userInfo.user.name}</Text>
                <Text style={styles.userEmail}>{userInfo.user.email}</Text>

                {_id && (
                    <TouchableOpacity
                        style={styles.viewDetailsButton}
                        onPress={() => navigation.navigate("User Details", { userId: _id })} // Pass the userId to UserDetails
                    >
                        <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const handleEditPost = async (postId) => {
        navigation.navigate('UpdatePost', { postId });
    };

    const handleDeletePost = async (postId) => {
        try {
            const storedToken = await AsyncStorage.getItem('jwt');
            const response = await fetch(`${baseURL}posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                },
            });

            if (response.ok) {
                Alert.alert('Success', 'Post deleted successfully.');
                triggerRefresh();
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Could not delete the post.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not delete the post.');
        }
    };

    const renderForumItem = ({ item }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'Approved':
                    return 'green';
                case 'Rejected':
                    return 'red';
                case 'Pending':
                    return 'orange';
                default:
                    return 'black'; // Default color if status is unknown
            }
        };
    
        return (
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
                {/* Apply the color based on the status */}
                <Text style={[styles.postStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
                <Text style={styles.forumTitle}>{item.title}</Text>
                <Text style={styles.forumContent}>{item.content}</Text>
        
                {/* Ellipsis Icon Positioned to the Upper Left Corner */}
                <TouchableOpacity
                    onPress={() => {
                        setSelectedPost(item); // Set the current post
                        setActionModalVisible(true); // Show the modal
                    }}
                    style={styles.ellipsisIconContainer}
                >
                    <Icon name="ellipsis-h" size={20} color="#007AFF" />
                </TouchableOpacity>
        
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
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedPostId(item._id);
                                            setSelectedCommentId(comment._id);
                                            setShowReplyModal(true);
                                        }}
                                    >
                                        <Text style={styles.replyLink}>Reply</Text>
                                    </TouchableOpacity>
                                    {comment.replies && comment.replies.length > 0 && (
                                        <View style={styles.repliesContainer}>
                                            {comment.replies
                                                .slice(0, expandedReplies[comment._id] ? comment.replies.length : 1)
                                                .map((reply) => (
                                                    <View key={reply._id} style={styles.reply}>
                                                        {reply.user?.image && (
                                                            <Image source={{ uri: reply.user.image }} style={styles.replyUserImage} />
                                                        )}
                                                        <View style={styles.replyTextContainer}>
                                                            <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}</Text>
                                                            <Text style={styles.replyDate}>
                                                                {new Date(reply.createdAt).toLocaleString()}
                                                            </Text>
                                                            <Text style={styles.replyContent}>{reply.content}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                                                <Text style={styles.show}>
                                                    {expandedReplies[comment._id] ? 'Hide Replies' : 'Show More Replies'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                    {item.comments.length > 2 && (
                        <TouchableOpacity onPress={() => toggleComments(item._id)}>
                            <Text style={styles.show}>{expandedComments[item._id] ? 'See Less Comments' : 'See More Comments'}</Text>
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
            </View>
        );
    };

    return (
        loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
            <Text>{error}</Text>
        ) : (
            <View style={styles.container}>
                {renderUserInfo()}
                {userPosts.length === 0 ? (
                    <Text style={styles.noPostsText}>You have no posts yet. Start sharing your thoughts!</Text>
                ) : (
                    <FlatList
                        data={userPosts}
                        renderItem={renderForumItem}
                        keyExtractor={(item) => item._id}
                        onRefresh={triggerRefresh}
                        refreshing={loading}
                    />
                )}
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
                <Modal
                    visible={actionModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setActionModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.actionModal}>
                            <TouchableOpacity
                                style={styles.actionOption}
                                onPress={() => {
                                    setActionModalVisible(false);
                                    // Call edit function or open an edit screen
                                    handleEditPost(selectedPost._id, selectedPost.content);
                                }}
                            >
                                <Text style={styles.actionText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionOption}
                                onPress={() => {
                                    setActionModalVisible(false);
                                    // Call delete function
                                    handleDeletePost(selectedPost._id);
                                }}
                            >
                                <Text style={styles.actionText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionOption}
                                onPress={() => setActionModalVisible(false)}
                            >
                                <Text style={styles.actionText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </View>




        )
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E0F8E6', padding: 10 },
    noPostsText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'gray', marginTop: 20, },
    userInfoContainer: { alignItems: 'center', marginBottom: 20 },
    profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    userName: { fontSize: 18, fontWeight: 'bold' },
    userEmail: { fontSize: 14, color: 'gray' },
    forumCard: { marginBottom: 20, padding: 10, borderRadius: 10, backgroundColor: '#f9f9f9' },
    userContainer: { flexDirection: 'row', alignItems: 'center' },
    userImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    forumUser: { fontWeight: 'bold' },
    forumDate: { fontSize: 12, color: 'gray' },
    forumTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
    forumContent: { fontSize: 16, color: 'gray' },
    forumImage: { width: '100%', height: 200, marginTop: 10, borderRadius: 10 },
    likesCommentsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    likeButton: { flexDirection: 'row', alignItems: 'center' },
    likeIcon: { marginRight: 5 },
    likesText: { fontSize: 14, color: '#007AFF' },
    divider: { width: 1, height: 15, backgroundColor: 'gray' },
    commentCountText: { fontSize: 14, color: '#007AFF' },
    commentsContainer: { marginTop: 15 },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    commentsHeader: { fontWeight: 'bold', marginBottom: 10 },
    comment: { marginBottom: 15 },
    commentUserImage: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
    commentTextContainer: { flex: 1 },
    commentUser: { fontWeight: 'bold' },
    commentDate: { fontSize: 12, color: 'gray' },
    commentContent: { fontSize: 14, color: 'gray' },
    replyLink: { color: '#007AFF', marginTop: 5 },
    show: { color: '#007AFF', marginTop: 5 },
    repliesContainer: { marginLeft: 40 },
    reply: { flexDirection: 'row', marginBottom: 10 },
    replyUserImage: { width: 25, height: 25, borderRadius: 12.5, marginRight: 10 },
    replyTextContainer: { flex: 1 },
    replyUser: { fontWeight: 'bold' },
    replyDate: { fontSize: 12, color: 'gray' },
    replyContent: { fontSize: 14, color: 'gray' },
    replyButton: { color: '#007AFF', marginTop: 5 },
    commentButton: { marginTop: 10, color: '#007AFF' },
    commentInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10, },
    addCommentButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
    addCommentButtonText: { color: 'white', textAlign: 'center' },
    modal: { position: 'absolute', top: '40%', left: '10%', width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
    replyInput: { borderColor: '#007AFF', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
    replyButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
    replyButtonText: { color: 'white', textAlign: 'center' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalOption: {
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    modalText: {
        fontSize: 18,
        color: '#007AFF',
    },

    container: { flex: 1, backgroundColor: '#E0F8E6', padding: 10 },
    ellipsisIconContainer: {
        position: 'absolute',
        top: 10,
        right: 10, // Upper left corner of the post card
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionModal: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%', // Adjust modal width
    },
    actionOption: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    postStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF6347', // You can change this to a color that fits your app's theme
        marginVertical: 5,
    },
    
});

export default UserProfile;
