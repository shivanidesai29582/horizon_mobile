import React, { useState,forwardRef} from 'react';
import { View, Modal, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

import styles from './style';

let componentIndex = 0;



function ModalPicker({ modalVisible =false, setModalVisible, children, data = [], onChangeSet, initValue = 'Select me!', style = {}, selectStyle = {}, optionStyle = {}, optionTextStyle = {}, sectionStyle = {}, sectionTextStyle = {}, cancelStyle = {}, cancelTextStyle = {}, overlayStyle = {}, cancelText = 'cancel' }, ref) {

  const animationType = 'slide';
  const [selected, setSelected] = useState(initValue);

  const onChange = (item) => {
    onChangeSet(item);
    setSelected(item.label)
    close();
  }

  const close = () => {
    setModalVisible(false)
  }

  const open = () => {
    setModalVisible(true)
  }

  const renderSection = (section) => {
    return (
      <View key={section.key} style={[styles.sectionStyle, sectionStyle]}>
        <Text style={[styles.sectionTextStyle, sectionTextStyle]}>{section.label}</Text>
      </View>
    );
  }

  const renderOption = (option) => {
    return (
      <TouchableOpacity key={option.key} onPress={() => onChange(option)}>
        <View
          style={[
            styles.optionStyle,
            optionStyle,
            {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <View style={{ flex: 0.15 }}>
            <Image source={option.image} resizeMode="stretch" style={{ width: 30, height: 16 }} />
          </View>
          <View style={{ flex: 0.7, alignItems: 'center' }}>
            <Text
              style={[
                styles.optionTextStyle,
                optionTextStyle,
                { color: '#434343', fontSize: 14 },
              ]}
            >
              {option.label}
            </Text>
          </View>
          <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.optionTextStyle,
                optionTextStyle,
                { color: 'grey', fontSize: 12 },
              ]}
            >
              {option.dialCode}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderOptionList = () => {
    const options = data?.map((item) => {
      if (item.section) {
        return renderSection(item);
      }

      return renderOption(item);
    });

    return (
      <View
        style={[styles.overlayStyle, overlayStyle]}
        key={`modalPicker${componentIndex++}`}
      >
        <View style={styles.optionContainer}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{ paddingHorizontal: 10 }}>{options}</View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={close}>
            <View style={[styles.cancelStyle, cancelStyle]}>
              <Text style={[styles.cancelTextStyle, cancelTextStyle]}>
                {cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderChildren = () => {
    if (children) {
      return children;
    }
  }

  const dp = (
    <Modal
      transparent
      visible={modalVisible}
      onRequestClose={close}
      animationType={animationType}
    >
      {renderOptionList()}
    </Modal>
  );

  return (
    <View style={style} ref={ref}>
      {dp}
      <TouchableOpacity onPress={open}>{renderChildren()}</TouchableOpacity>
    </View>
  );
}

export default forwardRef(ModalPicker);