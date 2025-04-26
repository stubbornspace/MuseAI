import { StyleSheet } from 'react-native';
import { useFontSize } from '../context/FontSizeContext';

export const createGlobalStyles = (fontSize: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: fontSize,
    color: '#FFFFFF',
  },
  title: {
    fontSize: fontSize + 4,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontSize,
  },
  // Common list styles
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  // Common item styles
  item: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: fontSize + 8,
    marginBottom: 5,
  },
  itemTag: {
    color: '#007AFF',
    fontSize: fontSize + 2,
  },
  // Common header styles
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1001,
  },
  // Common back button styles
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Search styles
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 10,
    minWidth: 300,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    padding: 8,
    fontSize: 16,
    minWidth: 250,
  },
  closeButton: {
    padding: 8,
  },
  // Search results styles
  searchResultsContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 100,
  },
  searchResultItem: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchResultTitle: {
    color: '#FFFFFF',
    fontSize: fontSize + 8,
    marginBottom: 5,
  },
  searchResultTag: {
    color: '#007AFF',
    fontSize: fontSize + 2,
  },
}); 