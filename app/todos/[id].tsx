import {useLocalSearchParams, useRouter} from "expo-router";
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {useFonts} from "expo-font";
import {Inter_500Medium} from "@expo-google-fonts/inter";
import {ThemeContext} from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Todo} from "@/data/todos";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {Octicons} from "@expo/vector-icons";

const EditScreen = () => {
    const {id} = useLocalSearchParams();
    const [todo, setTodo] = useState({});
    const router = useRouter();
    const [loaded, error] = useFonts({Inter_500Medium});
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async(id) => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp");
                const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;
                if(storageTodos && storageTodos.length) {
                    const myTodo = storageTodos.find((todo: Todo) => todo.id.toString() === id);
                    setTodo(myTodo);
                }
            } catch(e) {
                console.error(e)
            }
        }
        fetchData(id);
    }, [id]);

    if(!loaded && !error) return null;

    const styles = createStyles(theme, colorScheme);

    const handleSave = async() => {
        try {
            const savedTodo = {...todo, title: todo.title};
            const jsonValue = await AsyncStorage.getItem("TodoApp");
            const storageTodos = jsonValue !== null ? JSON.parse(jsonValue) : null;
            if(storageTodos && storageTodos.length) {
                const otherTodos = storageTodos.filter((todo: Todo) => todo.id !== savedTodo.id);
                const allTodos = [...otherTodos, savedTodo];
                await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
            } else {
                await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]));
            }
            router.push('/');
        } catch(e) {
            console.error(e);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder='Edit todo' placeholderTextColor='gray'
                           value={todo?.title || ''} maxLength={30}
                           onChangeText={(text) => setTodo(prev => ({...prev, title: text}))}/>
                <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                           style={{marginLeft: 10}}>
                    {colorScheme === 'dark' ?
                        <Octicons name='moon' size={36} color={theme.text} selectable={undefined}
                                  style={{width: 36}}/> :
                        <Octicons name='sun' size={36} color={theme.text} selectable={undefined} style={{width: 36}}/>}
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Text styles={styles.saveButtonText}>
                        Save
                    </Text>
                </Pressable>
                <Pressable onPress={() => router.push('/')} style={[styles.saveButton, {backgroundColor: 'red'}]}>
                    <Text styles={[styles.saveButtonText, {color: 'white'}]}>
                        Cancel
                    </Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
        </SafeAreaView>)
};

export default EditScreen;

const createStyles = (theme, colorScheme) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.background
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 6,
        width: '100%',
        marginHorizontal: 'auto',
        maxWidth: 1024,
        pointerEvents: 'auto'
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        minWidth: 0,
        color: theme.text
    },
    saveButton: {
        backgroundColor: theme.button,
        borderRadius: 5,
        padding: 10
    },
    saveButtonText: {
        fontSize: 18,
        color: colorScheme === 'dark' ? 'black' : 'white',
    }
});