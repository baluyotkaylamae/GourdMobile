// filteredWords.js
import { Alert } from 'react-native';

const badWordsList = [
  'Tanginamo', 'Gago', 'Bobo', 'Panget', 'pakyu', 'iskwater', 'walanghiya', 
  'bwiset', 'walang kwenta', 'tanga', 'inutil', 'Puta', 'Gaga', 'pokpok', 
  'bitch', 'Motherfucker', 'asshole'
]; // Add more words as needed

export const filterBadWords = (text) => {
  const regex = new RegExp(badWordsList.join('|'), 'gi'); // 'gi' ensures case insensitive matching and global replacement

  if (regex.test(text)) {
    Alert.alert('Warning', 'Your sentence contains inappropriate language and has been filtered.');
  }

  // Replace bad words with asterisks
  return text.replace(regex, (match) => '*'.repeat(match.length));
};
 