import React, {useState, useEffect} from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    Alert,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Colors, Dim } from "../Constants";
import Icon from "react-native-vector-icons/Feather";
import { SearchBar } from "react-native-elements";
import ConcertBlock from "../components/common/ConcertBlock";

const axios = require("axios").default;

/*
  -- DOCUMENTATION --
*/

//UNiversal sort function for all fields of the table
const sort_by = (field, reverse, primer) => {

    const key = primer ?
      function(x) {
        return primer(x[field]);
      } :
      function(x) {
        return x[field];
      };
  
    reverse = !reverse ? 1 : -1;
  
    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
  };

// concertData.sort(sort_by("name",false));
const HomeScreen = ({ navigation, props }) => {
    const [concertData, setData] = useState([]);
    const [search, updateSearch] = useState("");
    const [searchResults, setResult] = useState([]);
    const [inputSearch, setBool] = useState(false);
    const [queryData, setQueryData] = useState([]);
    const [query, setQuery] = useState(false);
    const [queryResult, setResponse] = useState(false);


    const searchEvent = async() => {
        setBool(true);
        setQuery(true);
    }

    const searchTicket = async() => {
        const getData = setTimeout(() => {
            axios
                .get(`http://localhost:4000/api/events/search/${search}`)
                .then((res)=>{
                    console.log(res.data)
                    setQueryData(res.data);
                    setQuery(false);
                })
                .catch((err)=>{
                    setQuery(false);
                    console.log(err);
                })
        }, 4000)
    }

    useEffect(() => {
        axios
        .get(`http://localhost:4000/api/events/`)
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [])

    useEffect(()=>{
        if (query){
            searchTicket();
        }
    }, [query])




    // AsyncStorage.getItem("@uid").then((uid)=>{console.log(uid);})
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                {inputSearch == 0 ? (
                    <View style={styles.topRow}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={styles.header}>Home</Text>
                            <Text style={styles.subheader}>
                                find concerts near you ▼
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Inbox Screen")}
                        >
                            <Icon
                                name={"bell"}
                                size={35}
                                color={Colors.darkGray}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: "column",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setBool(false);
                            }}
                        >
                            <View style={{marginLeft: 15, marginTop: Dim.height * 0.01}}>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {" "}
                                    ←{" "}
                                    <Text style={{ fontWeight: "normal" }}>
                                        {" "}
                                        Home{" "}
                                    </Text>{" "}
                                </Text>
                                
                            </View>
                        </TouchableOpacity>
                        <Text style={{fontSize: 30, fontWeight: "bold", 
                            marginTop: 10, marginBottom: -10, marginLeft: 25,
                        }}> Search</Text>
                    </View>
                )}
                <View style={styles.searchContainer}>
                    <SearchBar
                        placeholder="Search for artists..."
                        containerStyle={styles.containerStyle}
                        inputContainerStyle={
                            inputSearch
                                ? styles.inputSmallStyle
                                : styles.inputContainerStyle
                        }
                        onChangeText={(text) => {
                            updateSearch(text);
                            searchEvent(text)
                        }}
                        value={search}
                        onFocus={() => {
                            setBool(true);
                        }}
                    />
                </View>
                {inputSearch == 0 ? (
                    <View style={{ alignSelf: "center" }}>
                    <FlatList
                        data={concertData}
                        horizontal={false}
                        renderItem={({ item: concertData }) => {
                            return (
                                <ConcertBlock
                                    image={concertData.image}
                                    name={concertData.name}
                                    title={concertData.title}
                                    date={concertData.date}
                                    location={concertData.location}
                                    onPress={() =>
                                        navigation.navigate("Concert Screen", {
                                            image: concertData.image,
                                            name: concertData.name,
                                            date: concertData.localTime,
                                            location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                        })
                                    }
                                />
                            );
                        }}
                    />
                </View>
                ) : (<View style={{ alignSelf: "center" }}>
                <FlatList
                    data={queryData}
                    horizontal={false}
                    renderItem={({ item: concertData }) => {
                        return (
                            <ConcertBlock
                                image={concertData.image}
                                name={concertData.name}
                                title={concertData.title}
                                date={concertData.date}
                                location={concertData.location}
                                onPress={() =>
                                    navigation.navigate("Concert Screen", {
                                        image: concertData.image,
                                        name: concertData.name,
                                        date: concertData.localTime,
                                        location: `${concertData.venue} - ${concertData.city}, ${concertData.state}`,
                                    })
                                }
                            />
                        );
                    }}
                />
            </View>)}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "white", flex: 1 },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 20,
    },
    header: { fontSize: 30, fontWeight: "bold" },
    subheader: { fontSize: 17 },
    icon: { paddingTop: 10 },
    searchContainer: {
        borderColor: "transparent",
        width: Dim.width * 0.9,
        alignSelf: "center",
        marginVertical: 20,
    },
    containerStyle: {
        backgroundColor: "transparent",
        borderWidth: 0,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    inputContainerStyle: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: Colors.gray,
    },
    inputSmallStyle: {
        borderRadius: 10,
        padding: 2.5,
        backgroundColor: Colors.gray,
    },
    searchResults:{
        alignSelf: "center",
        width:Dim.width * 0.9,
        // marginLeft: 10,
        height: 200,
        backgroundColor: Colors.gray,
        borderRadius: 10,
    }
});

export default HomeScreen;
