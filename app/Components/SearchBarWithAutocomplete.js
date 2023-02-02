import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native'
import { Color } from '../common';
import ButtonComponent from "./ButtonComponent";


export default function SearchBarWithAutocomplete({ value, style, onChangeText, onPredictionTapped, predictions, showPredictions, OnAdd }) {

  const [inputSize, setInputSize] = useState({ width: 0, height: 0 })

  const passedStyles = Array.isArray(style) ? Object.assign({}, ...style) : style


  const inputBottomRadius = showPredictions ?
    {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
    :
    {
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30
    }

  const _renderPredictions = (predictions) => {
    const calculatedStyle = {
      width: inputSize.width
    }

    return (
      <FlatList
        data={predictions}
        bounces={false}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.predictionRow}
              onPress={() => onPredictionTapped(item.place_id, item.description)}
            >
              <Text
                numberOfLines={1}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps='handled'
        style={[styles.predictionsContainer, calculatedStyle]}
      />
    )
  }

  return (
    <View style={[styles.container, { ...passedStyles }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 40, paddingRight: 5, backgroundColor: '#cfcfcf' }}>
        <TextInput
          style={[styles.inputStyle, inputBottomRadius]}
          placeholder='Search by address'
          placeholderTextColor={Color.placeHolderGrey}
          value={value}
          onChangeText={onChangeText}
          returnKeyType='search'
          onLayout={(event) => {
            const { height, width } = event.nativeEvent.layout
            setInputSize({ height, width })
          }}
        />
        <ButtonComponent onPress={OnAdd} extraviewstyle={{ alignSelf: 'center', backgroundColor: Color.secondary, borderRadius: 40, paddingVertical: 7 }} extratextstyle={{ paddingVertical: 2 }} title={'Add'} />

      </View>
      {showPredictions && _renderPredictions(predictions)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  inputStyle: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#cfcfcf',
    borderRadius: 30,
    color: 'black',
    fontSize: 16
  },
  predictionsContainer: {
    backgroundColor: '#cfcfcf',
    paddingTop: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  predictionRow: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  }
})
