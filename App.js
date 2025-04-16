import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, Modal, FlatList, ScrollView, TextInput } from 'react-native';

export default function jogoAdivinhacao() {

  const [numeroSorteado, setNumeroSorteado] = useState(Math.floor(Math.random() * 101));
  const [palpite, setPalpite] = useState("");
  const [tentativas, setTentativas] = useState(0); 
  const [mensagem, setMensagem] = useState("Adivinhe o número");
  const [ranking, setRanking] = useState(Array(10).fill({ nome: "-", tentativas: Infinity }));
  const [mostraModal, setMostraModal] = useState(false);
  const [nomeJogador, setNomeJogador] = useState("");

  const aoChutar = () => {
    const palpiteConvertido = parseInt(palpite);

    if (isNaN(palpiteConvertido)) {
      setMensagem("Digite um valor válido!");
      return
    }

    setTentativas(tentativas + 1);

    if (palpiteConvertido === numeroSorteado) {
      setMensagem(`🎉 Você acertou! foram necessárias ${tentativas + 1} tentativas. o número sorteado era ${numeroSorteado}. `)

      verificarRanking(tentativas + 1);
    } else if (palpiteConvertido < numeroSorteado) {
      setMensagem("Você errou! o número é maior!");
    } else {
      setMensagem("Você errou! o número é menor!");
    }

    setPalpite("")
  };

  const verificarRanking = (tentativasAtual) => {
    const novoRanking = [...ranking];
    const indice = novoRanking.findIndex((entry) => tentativasAtual < entry.tentativas);

    if (indice !== -1) {
      setMostraModal(true);
    }
  };

  const salvarRanking = () => {
    const novoRanking = [...ranking];

    novoRanking.push({ nome: nomeJogador, tentativas: tentativas });
    novoRanking.sort((a, b) => a.tentativas - b.tentativas);
    setRanking(novoRanking.slice(0, 10));

    setMostraModal(false);
    setNomeJogador("");
  };

  const recomecarJogo = () => {
    setNumeroSorteado(Math.floor(Math.random() * 101));

    setPalpite("");
    setTentativas(0);
    setMensagem("Adivinhe o número!");

  };
  

  return (  
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Image source={require('./assets/thinking.webp')} style={styles.logo}/>
        <Text style={styles.titulo}>Qual o número?</Text>
        <Text style={styles.txt}>Tente adivinhar o número que o sistema sorteou entre 1 e 100</Text>
        <Text style={styles.mensagem}>{mensagem}</Text>
        <Text style={styles.emoji}>🦧</Text>

        {mensagem.startsWith("🎉") ? (
          <Button title='Recomeçar jogo' color="#32CD32" onPress={recomecarJogo}/>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              placeholder='Digite um número'
              value={palpite}
              onChangeText={setPalpite}
            />
            <Button title='Acho que é esse!' color="#FF69B4" onPress={aoChutar}/>
          </View>
        )}
      </View>

        <Modal visible={mostraModal} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.mensagem}>{mensagem}</Text>
              <Text style={styles.emoji}>🦧</Text>
              <Text style={styles.modalTitulo}>Novo top 10!</Text>
              <TextInput
                style={styles.input}
                placeholder='Digite seu Nome '
                value={nomeJogador}
                onChangeText={setNomeJogador}  
              />
              <Button title='Salvar'  onPress={salvarRanking}/>
            </View>
          </View>
        </Modal>

        {ranking.some(item => item.nome !== "-" && item.tentativas !== Infinity) && (
          <View style={styles.boxRanking}>
            <Text style={styles.titulo}> Ranking</Text>
            <FlatList
              data={ranking.filter(item => item.nome !== "-" && item.tentativas !== Infinity)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Text style={styles.ranking}>{index + 1}. {item.nome} - {item.tentativas} tentativas</Text>
              )}
            />
          </View>
        )}

    </ScrollView>


  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "#4B0082",
  },

  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    backgroundColor: "#4B0082",
    padding: 20,
  },

  logo: {
    width: "90%",
    height: 150,
    marginTop: 55,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    resizeMode: "contain"
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: 'center',
  },

  mensagem: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },

  emoji: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center',
  },

  txt: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  button: {
    width: "50%",
  },

  input: {
    height: 45,
    borderColor: "#98FF98",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    width: "85%",
    backgroundColor: "#F8F8FF",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#4B0082",
    fontWeight: '600',
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modal: {
    width: "80%",
    backgroundColor: "#2E0854",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },

  boxRanking: {
    marginTop: 15,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
    borderRadius: 15,
  },

  ranking: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
    color: "#FFFFFF",
  },
});
