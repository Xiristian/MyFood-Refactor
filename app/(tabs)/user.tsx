import { Pressable, StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { AuthService } from '@/database/services/AuthService';
import { User } from '@/database/types';

// Constants
const THEME = {
  COLORS: {
    PRIMARY: '#547260',
    SECONDARY: '#76A689',
    BACKGROUND: {
      LIGHT: '#FFFCEB',
      DARK: '#3C3C3C',
    },
    ICON: '#435B4D',
  },
  SPACING: {
    MARGIN: {
      TOP: 20,
      LEFT: 10,
    },
    PADDING: {
      HORIZONTAL: 20,
    },
  },
  ICON: {
    SIZE: {
      CAMERA: 40,
      CHEVRON: 24,
      ACCOUNT: 24,
    },
  },
  IMAGE: {
    SIZE: {
      CONTAINER: 200,
      PREVIEW: 150,
    },
    BORDER: {
      RADIUS: {
        CONTAINER: 100,
        PREVIEW: 50,
      },
      WIDTH: 2,
    },
  },
  FONT: {
    SIZE: {
      NAME: 24,
      MENU: 20,
    },
  },
};

// Custom Hooks
const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authService = AuthService.getInstance();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setProfileImage(currentUser.image || null);
      }
    };
    loadUser();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const updateProfileImage = async (imageUri: string) => {
    if (user?.id) {
      await authService.updateUser(user.id, { image: imageUri });
      setProfileImage(imageUri);
    }
  };

  return {
    user,
    profileImage,
    isMenuOpen,
    toggleMenu,
    updateProfileImage,
  };
};

const useImagePicker = (onImageSelected: (uri: string) => Promise<void>) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await onImageSelected(result.assets[0].uri);
    }
  };

  return {
    pickImage,
  };
};

// Components
const ProfileImage: React.FC<{
  imageUri: string | null;
  onPress: () => void;
}> = ({ imageUri, onPress }) => (
  <Pressable style={styles.imageContainer} onPress={onPress}>
    {imageUri ? (
      <Image source={{ uri: imageUri }} style={styles.image} />
    ) : (
      <FontAwesome name="camera" size={THEME.ICON.SIZE.CAMERA} color={THEME.COLORS.PRIMARY} />
    )}
  </Pressable>
);

const UserInfo: React.FC<{
  name: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}> = ({ name, isMenuOpen, onToggleMenu }) => (
  <View style={styles.userInfo} lightColor={THEME.COLORS.BACKGROUND.LIGHT} darkColor={THEME.COLORS.BACKGROUND.DARK}>
    <Text style={styles.userName}>{name}</Text>
    <Pressable onPress={onToggleMenu}>
      <FontAwesome
        name={isMenuOpen ? 'chevron-up' : 'chevron-down'}
        size={THEME.ICON.SIZE.CHEVRON}
        color={THEME.COLORS.ICON}
      />
    </Pressable>
  </View>
);

const UserMenu: React.FC = () => (
  <View style={styles.dropdown} lightColor={THEME.COLORS.BACKGROUND.LIGHT} darkColor={THEME.COLORS.BACKGROUND.DARK}>
    <View style={styles.dropdownItem} lightColor={THEME.COLORS.BACKGROUND.LIGHT} darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <MaterialCommunityIcons name="account" size={THEME.ICON.SIZE.ACCOUNT} color={THEME.COLORS.ICON} />
      <Text style={styles.dropdownItemText}>Editar cadastro</Text>
    </View>
  </View>
);

export default function UserProfileScreen() {
  const {
    user,
    profileImage,
    isMenuOpen,
    toggleMenu,
    updateProfileImage,
  } = useUserProfile();

  const { pickImage } = useImagePicker(updateProfileImage);

  if (!user) return null;

  return (
    <View style={styles.container} lightColor={THEME.COLORS.BACKGROUND.LIGHT} darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <ProfileImage imageUri={profileImage} onPress={pickImage} />
      <UserInfo name={user.name} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
      {isMenuOpen && <UserMenu />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    flex: 1,
  },
  imageContainer: {
    marginTop: THEME.SPACING.MARGIN.TOP,
    alignSelf: 'center',
    width: THEME.IMAGE.SIZE.CONTAINER,
    height: THEME.IMAGE.SIZE.CONTAINER,
    borderRadius: THEME.IMAGE.SIZE.CONTAINER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: THEME.IMAGE.BORDER.WIDTH,
    borderColor: THEME.COLORS.PRIMARY,
  },
  image: {
    width: THEME.IMAGE.SIZE.PREVIEW,
    height: THEME.IMAGE.SIZE.PREVIEW,
    borderRadius: THEME.IMAGE.BORDER.RADIUS.PREVIEW,
  },
  userInfo: {
    marginTop: THEME.SPACING.MARGIN.TOP,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
    alignItems: 'center',
  },
  userName: {
    fontSize: THEME.FONT.SIZE.NAME,
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: THEME.SPACING.MARGIN.TOP,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.MARGIN.TOP,
  },
  dropdownItemText: {
    marginLeft: THEME.SPACING.MARGIN.LEFT,
    fontSize: THEME.FONT.SIZE.MENU,
  },
});
