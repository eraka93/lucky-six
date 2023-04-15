import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';

export default function App() {
  const [balls, setBalls] = useState([])
  const [sorted, setSorted] = useState([])
  const [round, setRound] = useState(10)
  const [roundNumber, setRoundNumber] = useState(0)
  const [refresh, setRefresh] = useState(false)

  const colorsBorder = ['#9a9a9a', '#dd1f1f', '#1cc51c', '#0087ff', '#a82def', '#844e14', '#efc82d', '#cb5b00'];
  const colors = ['rgba(154,154,154,0.3)', 'rgba(221,31,31,0.3)', 'rgba(28,197,28,0.3)', 'rgba(0,135,255,0.3)', 'rgba(168,45,239,0.3);', 'rgba(132,78,20,0.3)', 'rgba(239,200,45,0.3)', 'rgba(203,91,0,0.3)'];
  const colorsBar = ['white', 'E82916', '#E85F16', '#AECD13', '#109218', '#0E731D']

  useEffect(() => {
    fetch(`https://ngs.7platform.com/api_open/web/events?cpvUuid=0f3851bd-6fe8-4ed5-8fa1-c8f03aecc067&product=LuckySix&count=${round > 0 ? round : 10}`)
      .then(response => response.json())
      .then(data => {
        let count = {}
        setRoundNumber(data[0].eventId)
        data.map(rounds => {
          let roundBall = rounds.balls
          roundBall.map(ball => {
            count[ball.ball] = (count[ball.ball] || 0) + 1;
          })
        })
        let numberCounts = Object.entries(count).map(([number, count]) => ({ number, count }));
        setBalls(numberCounts)
      })
      .catch(error => console.error(error));
  }, [round, refresh]);

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
  }, [round])

  const sort = () => {
    const sorted = [...balls].sort((a, b) => b.count - a.count);
    setSorted(sorted);
  }

  const unSort = () => {
    setSorted([]);
  }

  const toggle = () => {
    unSort();
    setRefresh(!refresh);
  };

  const handleTextChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setRound(numericValue);
  }

  console.log("renderuje se")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistika lucky six za poslednjih {round} rundi</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => sort()} style={styles.button}><Text style={{ color: 'white' }}>Sort</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => unSort()} style={styles.button}><Text style={{ color: 'white' }}>Brojevi</Text></TouchableOpacity>
      </View>
      <TextInput
        value={round.toString()}
        onChangeText={handleTextChange}></TextInput>
      <TouchableOpacity onPress={toggle}><Text>Refresh</Text></TouchableOpacity>
      <Text style={{ color: 'white', alignSelf: 'flex-end' }}>Poslednja runda: {roundNumber}</Text>
      {round > 0 ? <FlatList
        data={sorted[1] ? sorted : balls}
        keyExtractor={balls.number}
        renderItem={renderItem}
        numColumns={8} /> : <Text>Izaberi dobro broj rundi</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: 'hsl( 210, 4% , 18% )',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10
  },
  title: {
    color: 'white',
    fontSize: 16,
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
    margin: 10
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
  }
});
