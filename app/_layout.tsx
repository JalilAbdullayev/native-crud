import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ThemeProvider} from "@/context/ThemeContext";

const RootLayout = () =>
    <ThemeProvider>
        <SafeAreaProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="todos/[id]"/>
            </Stack>
        </SafeAreaProvider>
    </ThemeProvider>;

export default RootLayout;