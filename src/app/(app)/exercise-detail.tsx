import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise, ExercisesData } from "@/lib/sanity/types";
import { defineQuery } from "groq";

const singleExerciseQuery = defineQuery(
  `*[_type =="exercise" && _id== $id][0]`
);

export default function ExerciseDetail() {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      try {
        const exerciseData: ExercisesData = await client.fetch(
          singleExerciseQuery,
          { id }
        );
        console.log(exerciseData);
        setExercise(exerciseData);
      } catch (error) {
        console.log("Error fetching exercise", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      {/* Header with close button */}
      <View className="absolute top-12 left-0 ring-0 z-10 px-4">
        <TouchableOpacity
          className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop:blur-sm"
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* hero image */}
        <View className="h-80 bg-white relative">
          {/* {exercise?.image ? (
            <Image
              source={{ uri: urlFor(exercise.image?.asset?._ref).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 justify-center">
              <Ionicons name="fitness" size={80} color="white" />
            </View>
          )} */}
          {exercise?.image ? (
            <Image
              source={{ uri: urlFor(exercise.image).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 justify-center items-center">
              <Ionicons name="fitness" size={80} color="white" />
              <Text>something went wrong</Text>
            </View>
          )}
          {/* gradient overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
