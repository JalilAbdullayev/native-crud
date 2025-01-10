import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ThemeProvider} from "@/context/ThemeContext";

const RootLayout = () =>
    <ThemeProvider>
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name='index' options={{headerShown: false}}/>
            </Stack>
        </SafeAreaProvider>
    </ThemeProvider>;

export default RootLayout;