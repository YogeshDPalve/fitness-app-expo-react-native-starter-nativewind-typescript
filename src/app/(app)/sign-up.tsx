import * as React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [isloading, setIsloading] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsloading(true);
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsloading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
    }
    setIsloading(true);
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsloading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-6">
            <View className="flex-1 justify-center">
              <View className="items-center mb-8">
                <View className="w-20 h-19 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-xl">
                  <Ionicons name="mail" size={40} color="white" />
                </View>
                <Text className="text-3xl font-extrabold text-gray-900 mb-2">
                  Check Your Email
                </Text>
                <Text className="text-lg text-gray-600 text-center">
                  We've sent a verification code to {"\n"}
                  {emailAddress}
                </Text>
              </View>
              {/* verification form */}
              <View className="bg-white rounded-2xl p-6 shadow-sm border   border-gray-100 mb-6 ">
                <Text className="text-2xl  font-extrabold text-gray-900 mb-6 text-center">
                  Enter Verification Code
                </Text>
                <View className="mb-6">
                  <Text className="text-sm font-medium  text-gray-700 mb-2">
                    Verification Code
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2 border-gray-200 border">
                    <Ionicons name="key-outline" size={20} color="#687280" />
                    <TextInput
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={setCode}
                      className="flex-1 ml-3 text-gray-900 text-center text-lg tracking-widest"
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!isloading}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={isloading}
                  className={`rounded-xl py-4 shadow-sm mb-4 ${
                    isloading ? "bg-gray-400" : "bg-green-600"
                  }`}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center justify-center ">
                    {isloading ? (
                      <Ionicons name="refresh" size={20} color="white" />
                    ) : (
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="white"
                      />
                    )}
                    <Text className="text-white font-semibold text-lg ml-2">
                      {isloading ? "Verifying Email..." : "Verify Email"}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* resent code */}
                <TouchableOpacity className="py-2">
                  <Text className="text-blue-500 font-semibold text-center">
                    Didn't receive the code? Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="pb-6">
              <Text className="text-center text-gray-500 text-sm">
                Ready to start your fitness journey today ?
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* main */}
          <View className="flex-1 justify-center">
            {/* logo branding */}
            <View className="items-center mb-8 ">
              <View className="w-20 h-18 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-2xl shadow-gray-600">
                <Ionicons name="fitness" size={45} color="white" />
              </View>
              <Text className="text-3xl font-extrabold text-gray-900 mb-2">
                Join FitTracker
              </Text>
              <Text className="text-base text-gray-600 text-center">
                Track your fitness journey {"\n"} and reach your goals
              </Text>
            </View>
            {/* signup form */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 w-full">
              <Text className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
                Create Your Account
              </Text>
              {/* email input */}
              <View className="mb-4">
                <Text className="text-sm font-medium  text-gray-700 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2 border-gray-200 border">
                  <Ionicons name="mail-outline" size={20} color="#687280" />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setEmailAddress}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isloading}
                  />
                </View>
              </View>
              {/* password input */}
              <View className="mb-6">
                <Text className="text-sm font-medium  text-gray-700 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2 border-gray-200 border">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#687280"
                  />
                  <TextInput
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isloading}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1 ml-1">
                  Must be at least 8 characters
                </Text>
              </View>
              {/* signup button */}
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isloading}
                className={`rounded-xl py-4 shadow-sm mb-4 ${
                  isloading ? "bg-gray-400" : "bg-blue-600"
                }`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  {isloading ? (
                    <Ionicons name="refresh" size={20} color="white" />
                  ) : (
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color="white"
                    />
                  )}
                  <Text className="text-white font-semibold text-lg ml-2">
                    {isloading ? "Creating Account" : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* terms */}
              <Text className="text-xs text-gray-500 text-center mb-4">
                By singing up, you aggree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>
            {/* signin link */}
            <View className="flex-row mt-5 justify-center items-center ">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600  font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
          {/* footer */}
        </View>
        <View className="pb-6">
          <Text className="text-center text-gray-500 text-sm">
            Ready to start your fitness journey today ?
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
