import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    getAllMenu,
    getCategories,
    saveMenu,
    setupDb
} from '../DB_Save/dataBase';

const API = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';



const Home = () => {

    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleCategory = (cat) => {
        setSelected(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)   // si estaba, lo quitas (deseleccionar)
                : [...prev, cat]                // si no estaba, lo agregas (seleccionar)
        );
    };


    useEffect(() => {
        const ac = new AbortController();

        const getDataFromApiAsync = async () => {
            try {

                setLoading(true);
                setError(null);
                await setupDb();

                const local = await getAllMenu();
                if (local.length) {
                    setData(local);
                    setCategories(await getCategories());
                    return;
                }

                const res = await fetch(API, { signal: ac.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                await saveMenu(json.menu);
                const fresh = await getAllMenu();
                setData(fresh);
                setCategories(await getCategories());
            } catch (e) {
                if (e.name !== 'AbortError') setError(e);
            } finally {
                setLoading(false);
            }
        };

        getDataFromApiAsync();
        return () => ac.abort(); // cleanup
    }, []);

    const RsponseAPI = () => {
        if (loading) return <Text>Cargando...</Text>;
        if (error) return <Text>Ups: {String(error.message || error)}</Text>;
    }



    const renderItem = ({ item }) => {
        const active = selected.includes(item);
        return (
            <Pressable
                onPress={() => toggleCategory(item)}
                style={({ pressed }) => [
                    homeStyle.chip,
                    active && homeStyle.chipActive,
                    pressed && { opacity: 0.85 },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Category ${item}`}
            >
                <Text style={[homeStyle.chipText, active && homeStyle.chipTextActive]}>{item}</Text>
            </Pressable>
        );
    };

    const renderDishes = ({ item }) => {

        const src = {
            uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${item.image}`,
        };
        return (
            <View style={homeStyle.dishBox}>
                <View style={homeStyle.dishBoxText}>
                    <Text style={homeStyle.dishTitle}>{item.name}</Text>
                    <Text style={homeStyle.dishDescription}>{item.description}</Text>
                    <Text style={homeStyle.dishPrice}>{`$${item.price}`}</Text>
                </View>
                <Image style={homeStyle.dishImage} source={src} />
            </View>
        )
    };

    const dishes = useMemo(() => {
        if (!selected.length) return data; // sin filtros → muestra todo
        const sel = new Set(selected.map(s => s.toLowerCase()));
        return data.filter(d => sel.has(String(d.category).toLowerCase()));
    }, [data, selected]);


    return (
        <View style={homeStyle.content}>
            <View style={homeStyle.welcomeSection}>
                <Text style={homeStyle.titleText}>Litte Lemon</Text>
                <View style={homeStyle.welcomeBox}>
                    <View style={homeStyle.textBox}>
                        <Text style={homeStyle.subTitle}>chicago</Text>
                        <Text style={homeStyle.descriptionText}>
                            We are a family owned
                            Mediterranean restaurant,
                            focused on traditional
                            recipies served with a
                            modern twist.
                        </Text>
                    </View>
                    <Image
                        style={homeStyle.welcomeImage}
                        source={require('../../assets/images/Hero-image.png')} />
                </View>
                <Pressable style={homeStyle.peressIcon}>
                    <Ionicons name="search" size={28} color="black" />
                </Pressable>
            </View>
            <View style={homeStyle.shipSection}>
                <Text style={homeStyle.heading}>ORDER FOR DELIVERY!</Text>
                <FlatList
                    data={categories}
                    keyExtractor={(s) => s}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={homeStyle.listContent}
                />
                <RsponseAPI />
            </View>

            <FlatList
                style={{ flex: 1 }}
                data={dishes}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={renderDishes}
                contentContainerStyle={homeStyle.dishContent}
                showsVerticalScrollIndicator={true}

            />
        </View>

    )

};

const homeStyle = StyleSheet.create({
    content: {
        backgroundColor: '#ffffffdc',
        flex: 1,
    },
    welcomeSection: {
        backgroundColor: '#495E57',
        padding: 14,
    },
    titleText: {
        color: '#F4CE14',
        fontSize: 54,
        fontWeight: '500'
    },
    welcomeBox: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textBox: {
        maxWidth: '60%',
    },
    subTitle: {
        color: 'white',
        fontSize: 28,
    },
    descriptionText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'left',
        paddingVertical: 14,

    },
    contntentImage: {

    },
    welcomeImage: {
        resizeMode: 'cover',
        width: 130,
        height: 134,
        borderRadius: 12,
    },
    peressIcon: {
        backgroundColor: '#dad8d8ff',
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginVertical: 10,
    },
    //ORDER FOR DELIVERY SECTION
    shipSection: {
        marginVertical: 18,
        height: 100,
        justifyContent: 'center'

    },
    heading: {
        fontSize: 22,
        fontWeight: "800",
        marginHorizontal: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        gap: 22, // RN 0.71+; si no, usa itemSeparatorComponent
        alignItems: 'center',
        justifyContent: 'center',
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
        backgroundColor: "#E9EFEA",
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: {
        backgroundColor: "#D7E4DC",
    },
    chipText: {
        fontWeight: "700",
        color: "#2F4B45",
        fontSize: 18,
    },
    //Dishes section
    dishContent: {
        marginHorizontal: 14,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#8d8d8dff'
    },
    dishBox: {
        marginBottom: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#dad7d7ff',
        height: 130,
    },
    dishBoxText: {
        maxWidth: '74%'
    },
    dishTitle: {
        fontSize: 18,
        fontWeight: 'bold',

    },
    dishDescription: {
        fontSize: 14,
        color: 'grey',
        marginVertical: 4,
        //maxWidth: '70%'
    },
    dishPrice: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    dishImage: {
        width: 100,
        height: 100,
        backgroundColor: 'grey',
    },

})

export default Home;