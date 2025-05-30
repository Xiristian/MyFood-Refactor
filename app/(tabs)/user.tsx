import { Pressable, StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AuthService } from '@/database/services/AuthService';
import { User } from '@/database/types';
import { THEME } from '@/constants/theme';

interface UserMenuProps {
  onLogout: () => void;
}

const UserInfo: React.FC<{
  name: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}> = ({ name, isMenuOpen, onToggleMenu }) => (
  <View
    style={styles.userInfo}
    lightColor={THEME.COLORS.BACKGROUND.LIGHT}
    darkColor={THEME.COLORS.BACKGROUND.DARK}>
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

const UserMenu: React.FC<UserMenuProps> = ({ onLogout }) => (
  <View
    style={styles.dropdown}
    lightColor={THEME.COLORS.BACKGROUND.LIGHT}
    darkColor={THEME.COLORS.BACKGROUND.DARK}>
    <View
      style={styles.dropdownItem}
      lightColor={THEME.COLORS.BACKGROUND.LIGHT}
      darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <MaterialCommunityIcons
        name="account"
        size={THEME.ICON.SIZE.ACCOUNT}
        color={THEME.COLORS.ICON}
      />
      <Text style={styles.dropdownItemText}>Editar cadastro</Text>
    </View>
    <Pressable style={styles.dropdownItem} onPress={onLogout}>
      <MaterialCommunityIcons
        name="logout"
        size={THEME.ICON.SIZE.ACCOUNT}
        color={THEME.COLORS.ICON}
      />
      <Text style={styles.dropdownItemText}>Sair</Text>
    </Pressable>
  </View>
);

export default function UserScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  });

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && user) {
      const image = result.assets[0].uri;
      try {
        await authService.updateUser(user.id, { image });
        setUser((prevUser) => (prevUser ? { ...prevUser, image } : null));
      } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.imageContainer} onPress={handleImagePick}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="camera"
            size={THEME.ICON.SIZE.CAMERA}
            color={THEME.COLORS.ICON}
          />
        )}
      </Pressable>
      <UserInfo
        name={user.name}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && <UserMenu onLogout={handleLogout} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto',
    width: '100%',
    backgroundColor: THEME.COLORS.BACKGROUND.DARK,
  },
  dropdown: {
    marginTop: THEME.SPACING.MARGIN.TOP,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
  },
  dropdownItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: THEME.SPACING.MARGIN.TOP,
  },
  dropdownItemText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.MENU,
    marginLeft: THEME.SPACING.MARGIN.LEFT,
  },
  image: {
    borderRadius: THEME.BORDER.RADIUS.PREVIEW,
    height: THEME.IMAGE.SIZE.PREVIEW,
    width: THEME.IMAGE.SIZE.PREVIEW,
  },
  imageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: THEME.COLORS.PRIMARY,
    borderRadius: THEME.BORDER.RADIUS.CONTAINER,
    borderWidth: THEME.BORDER.WIDTH,
    height: THEME.IMAGE.SIZE.CONTAINER,
    justifyContent: 'center',
    marginTop: THEME.SPACING.MARGIN.TOP,
    width: THEME.IMAGE.SIZE.CONTAINER,
  },
  userInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.SPACING.MARGIN.TOP,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
  },
  userName: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.NAME,
    fontWeight: 'bold',
  },
});
