import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { GradientBackground } from "../../components/GradientBackground";
import { Typography } from "../../components/Typography";
import { MOCK_CATEGORIES } from "../../core/database/mockData";
import { MockPhrasesRepository } from "../../core/database/mockPhrasesRepository";
import { Category, Phrase } from "../../core/database/types";
import { Storage } from "../../core/storage/storage";
import { BorderRadius, Colors, Spacing } from "../../core/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const repository = new MockPhrasesRepository();

interface FeedItemProps {
  phrase: Phrase;
  category: Category;
  isLiked: boolean;
  onLike: () => void;
  onCustomize: () => void;
  handleReset: () => void;
  isActive: boolean;
}

const FeedItem: React.FC<FeedItemProps> = ({
  phrase,
  category,
  isLiked,
  onLike,
  onCustomize,
  handleReset,
  isActive,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  const heartBurst = useRef(new Animated.Value(0)).current;
  const lastTap = useRef<number>(0);
  const entryAnim = useRef<Animated.CompositeAnimation | null>(null);
  const burstAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isActive) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      entryAnim.current = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 10,
          tension: 50,
          useNativeDriver: true,
        }),
      ]);
      entryAnim.current.start();
    } else {
      if (entryAnim.current) {
        entryAnim.current.stop();
        entryAnim.current = null;
      }
      if (burstAnim.current) {
        burstAnim.current.stop();
        burstAnim.current = null;
      }
    }
  }, [isActive]);

  const triggerHeartBurst = () => {
    if (burstAnim.current) {
      burstAnim.current.stop();
    }
    heartBurst.setValue(0);
    burstAnim.current = Animated.sequence([
      Animated.parallel([
        Animated.spring(heartBurst, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(likeScale, {
          toValue: 1.3,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(heartBurst, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
    burstAnim.current.start();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!isLiked) {
        onLike();
      }
      triggerHeartBurst();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    lastTap.current = now;
  };

  const handleLikePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isLiked) {
      triggerHeartBurst();
    }
    onLike();
  };

  const heartScale = heartBurst.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.4, 1],
  });

  const heartOpacity = heartBurst.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <GradientBackground colors={category.gradients} style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap} style={styles.itemTouchable}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.quoteMarkContainer}>
            <Text style={styles.quoteMark}>{"\u201C"}</Text>
          </View>

          <Typography variant="serif" size="5xl" weight="regular" italic={true} style={styles.phraseText}>
            {phrase.text}
          </Typography>

          {phrase.author && phrase.author !== "Unknown" && (
            <View style={styles.authorContainer}>
              <View style={styles.authorDivider} />
              <Typography variant="dmSans" size="base" weight="medium" color={Colors.slate[600]}>
                {phrase.author}
              </Typography>
            </View>
          )}

          <View style={styles.divider} />
        </Animated.View>

        {/* Center heart burst animation */}
        <Animated.View
          style={[
            styles.heartBurst,
            {
              opacity: heartOpacity,
              transform: [{ scale: heartScale }],
            },
          ]}
          pointerEvents="none"
        >
          <MaterialIcons name="favorite" size={100} color={Colors.primary} />
        </Animated.View>
      </TouchableOpacity>

      {/* Old-style side buttons */}
      <View style={styles.sideButtons}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={handleLikePress}>
            <View style={[styles.buttonCircle, isLiked && styles.buttonCircleActive]}>
              <MaterialIcons
                name={isLiked ? "favorite" : "favorite-border"}
                size={32}
                color={isLiked ? "#fff" : Colors.slate[900]}
              />
            </View>
          </TouchableOpacity>
          <Typography size="xs" weight="bold" color={Colors.slate[700]}>
            {phrase.likes.toLocaleString()}
          </Typography>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={onCustomize}>
            <View style={styles.buttonCircle}>
              <MaterialIcons name="style" size={32} color={Colors.slate[900]} />
            </View>
          </TouchableOpacity>
          <Typography size="xs" weight="bold" color={Colors.slate[700]}>
            Style
          </Typography>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={onCustomize}>
            <View style={styles.buttonCircle}>
              <MaterialIcons name="share" size={32} color={Colors.slate[900]} />
            </View>
          </TouchableOpacity>
          <Typography size="xs" weight="bold" color={Colors.slate[700]}>
            Share
          </Typography>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => handleReset()}>
            <View style={styles.buttonCircle}>
              <MaterialIcons name="delete" size={32} color={Colors.slate[900]} />
            </View>
          </TouchableOpacity>
          <Typography size="xs" weight="bold" color={Colors.slate[700]}>
            Reset
          </Typography>
        </View>
      </View>
    </GradientBackground>
  );
};

export default function FeedScreen() {
  const router = useRouter();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [likedPhrases, setLikedPhrases] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<FlatList<Phrase>>(null);

  useEffect(() => {
    const load = async () => {
      const settings = await Storage.getOnboardingSettings();
      const data = await repository.getPhrases(settings?.selectedCategories);
      setPhrases(data);
      const liked = await Storage.getLikedPhrases();
      setLikedPhrases(liked);
    };
    load();
  }, []);

  const handleLike = async (phraseId: string) => {
    await Storage.toggleLikedPhrase(phraseId);
    const liked = await Storage.getLikedPhrases();
    setLikedPhrases(liked);
    await repository.toggleLike(phraseId);
    setPhrases((prev) =>
      prev.map((p) =>
        p.id === phraseId ? { ...p, likes: p.likes + (liked.includes(phraseId) ? -1 : 1) } : p,
      ),
    );
  };

  const handleCustomize = (phrase: Phrase) => {
    router.push({
      pathname: "/customizer",
      params: {
        phraseId: phrase.id,
        text: phrase.text,
        author: phrase.author,
      },
    });
  };

  const handleReset = async () => {
    await Storage.clearOnboardingSettings();
    router.push("/welcome");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const getCategory = (categoryId: string): Category => {
    return MOCK_CATEGORIES.find((c) => c.id === categoryId) || MOCK_CATEGORIES[0];
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Phrase; index: number }) => (
      <FeedItem
        phrase={item}
        category={getCategory(item.categoryId)}
        isLiked={likedPhrases.includes(item.id)}
        onLike={() => handleLike(item.id)}
        onCustomize={() => handleCustomize(item)}
        handleReset={handleReset}
        isActive={index === activeIndex}
      />
    ),
    [likedPhrases, activeIndex],
  );

  const keyExtractor = useCallback((item: Phrase) => item.id, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollRef}
        data={phrases}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        disableIntervalMomentum
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <MaterialIcons name="wb-sunny" size={16} color={Colors.primary} />
          <Text style={styles.headerText}>SHINE ON</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  itemContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  itemTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    maxWidth: "85%",
    paddingHorizontal: Spacing.lg,
  },
  quoteMarkContainer: {
    marginBottom: Spacing.md,
  },
  quoteMark: {
    fontSize: 64,
    fontFamily: "Lora_400Regular",
    color: Colors.primary,
    opacity: 0.3,
    lineHeight: 70,
  },
  phraseText: {
    textAlign: "center",
    lineHeight: 64,
  },
  authorContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  authorDivider: {
    width: 32,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.4,
    borderRadius: 1,
  },
  divider: {
    width: 48,
    height: 4,
    backgroundColor: "rgba(238, 95, 43, 0.4)",
    borderRadius: 2,
    marginTop: Spacing.lg,
  },
  heartBurst: {
    position: "absolute",
    zIndex: 10,
  },
  sideButtons: {
    position: "absolute",
    right: Spacing.md,
    bottom: Spacing.xxl * 2,
    gap: Spacing.lg,
  },
  buttonGroup: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  buttonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  header: {
    position: "absolute",
    top: Spacing.xxl,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.60)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.90)",
  },
  headerText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_700Bold",
    color: Colors.slate[600],
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  progressContainer: {
    position: "absolute",
    bottom: Spacing.xxl,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    zIndex: 10,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  progressDotActive: {
    width: 20,
    backgroundColor: Colors.primary,
  },
});
