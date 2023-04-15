import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Pressable, ScrollView } from 'react-native';

export default function App() {
  const [balls, setBalls] = useState([])
  const [sorted, setSorted] = useState([])
  const [round, setRound] = useState(10)
  const [roundNumber, setRoundNumber] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [numberPicked, setNumberPicked] = useState(35)

  const colorsBorder = ['#9a9a9a', '#dd1f1f', '#1cc51c', '#0087ff', '#a82def', '#844e14', '#efc82d', '#cb5b00'];
  const colors = ['rgba(154,154,154,0.3)', 'rgba(221,31,31,0.3)', 'rgba(28,197,28,0.3)', 'rgba(0,135,255,0.3)', 'rgba(168,45,239,0.3);', 'rgba(132,78,20,0.3)', 'rgba(239,200,45,0.3)', 'rgba(203,91,0,0.3)'];

  useEffect(() => {
    fetch(`https://ngs.7platform.com/api_open/web/events?cpvUuid=0f3851bd-6fe8-4ed5-8fa1-c8f03aecc067&product=LuckySix&count=${round > 0 ? round : 10}`)
      .then(response => response.json())
      .then(data => {
        let count = {}
        setRoundNumber(data[0].eventId)
        data.map(rounds => {
          let roundBall = rounds.balls.slice(0, numberPicked)
          roundBall.map(ball => {
            count[ball.ball] = (count[ball.ball] || 0) + 1;
          })
        })
        let numberCounts = Object.entries(count).map(([number, count]) => ({ number, count }));
        setBalls(numberCounts)
      })
      .catch(error => console.error(error));
  }, [round, refresh, numberPicked]);

  const renderItem = useCallback(({ item }) => {
    const { number, count } = item
    let countRound = count / round
    let widthCount = countRound * 30
    let goldFont = countRound > 0.8 ? { color: 'gold', fontWeight: 'bold' } : null
    let goldBox = countRound > 0.8 ? { backgroundColor: `rgba(241, 203, 83 ,0.3)` } : null
    let colorBar = Math.floor(count / round * 4)
    colorBar = colorBar > 0 ? colorBar + 1 : colorBar
    return (
      <View style={styles.ballCount}>
        <View style={[styles.ballCountBox, goldBox]}>
          <View style={[styles.ball, { backgroundColor: colors[number % 8], borderColor: colorsBorder[number % 8] }]}><Text style={styles.ballText}>{number}</Text></View>
          <View style={{ width: 30, height: 8, backgroundColor: 'white', marginHorizontal: 5, marginTop: 5 }}>
            <View style={{ width: widthCount, height: 8, backgroundColor: `rgba(11, 93, 40, ${countRound})`, borderWidth: 0.2, borderColor: 'white' }}></View>
          </View>
          <Text style={[styles.ballText, goldFont]}>{count}</Text>
        </View>
      </View>
    )
  }, [round, numberPicked, refresh])

  const sort = () => {
    const sorted = [...balls].sort((a, b) => b.count - a.count);
    setSorted(sorted);
  }

  const unSort = () => {
    setSorted([]);
  }

  const picked = (number) => {
    unSort();
    setNumberPicked(number);
    console.log(number)
  }

  const toggle = () => {
    unSort();
    setNumberPicked(35)
    setRefresh(!refresh);
  };

  const handleTextChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setNumberPicked(35)
    setRound(numericValue);
  }
  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Statistika lucky six za poslednjih {round} rundi</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
          <Text style={{ color: 'white' }}>Izaberi broj rundi: </Text>
          <TextInput
            value={round.toString()}
            onChangeText={handleTextChange} style={styles.input}></TextInput>
        </View>
        <View style={{ width: '100%' }}>
          {round > 0 ? <FlatList
            data={sorted[1] ? sorted : balls}
            keyExtractor={balls.number}
            renderItem={renderItem}
            numColumns={8} /> : <Text>Izaberi dobro broj rundi</Text>}
        </View>
        <View style={{ flexDirection: 'row', width: '100%', marginVertical: 2 }}>
          <Pressable onPress={toggle} style={[styles.button, { alignSelf: 'flex-start' }]}><Text>Refresuj</Text></Pressable>
          <Text style={{ color: 'white', marginLeft: 'auto' }}>Poslednja runda: {roundNumber}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={() => sort()} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Sort</Text></Pressable>
          <Pressable onPress={() => unSort()} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Brojevi</Text></Pressable>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={() => picked(5)} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Bubanj</Text></Pressable>
          <Pressable onPress={() => picked(10)} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Prvih 10</Text></Pressable>
          <Pressable onPress={() => picked(15)} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Prvih 15</Text></Pressable>
          <Pressable onPress={() => picked(20)} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Prvhi 20</Text></Pressable>
          <Pressable onPress={() => picked(35)} style={styles.button}><Text style={{ color: 'white', fontSize: 16 }}>Svi</Text></Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'hsl( 210, 4% , 18% )',
    alignItems: 'center',
    justifyContent: 'center ',
    padding: 10,
    maxWidth: 1000
  },
  title: {
    color: 'white',
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '600'
  },
  input: {
    backgroundColor: 'white',
    textAlign: 'center',
    borderRadius: 3,
    width: 40,
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#27729E',
    borderColor: '#204C66',
    borderWidth: 1,
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  ballCount: {
    width: 100 / 8 + '%',
    maxWidth: 100,
  },
  ballCountBox: {
    margin: 2,
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: 'white',
    borderRadius: 3,
  },
  ball: {
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 5
  },
  ballText: {
    color: 'white',
    fontSize: 12,
    margin: 5
  },
  refresh: {
    width: 20, height: 20
  }
});
