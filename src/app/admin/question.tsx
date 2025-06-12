import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const AnswerForm = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log({ email, answer });
    alert("Answer submitted successfully!");
    setEmail("");
    setAnswer("");
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-6">Answer Question</Text>

      <View className="mb-4">
        <Text className="mb-2 font-medium">Email:</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded bg-white"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mb-6">
        <Text className="mb-2 font-medium">Your Answer:</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded bg-white h-32"
          placeholder="Type your answer here..."
          multiline
          value={answer}
          onChangeText={setAnswer}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold">Submit Answer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AnswerForm;
