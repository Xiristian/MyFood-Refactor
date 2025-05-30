import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from './Themed';
import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { THEME } from '@/constants/theme';

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ date, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowCalendar(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  return (
    <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.datePickerButton}>
      {Platform.OS !== 'ios' && (
        <Text style={styles.dateText}>{moment(date).format('DD/MM/yyyy')}</Text>
      )}
      {(showCalendar || Platform.OS === 'ios') && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          display="default"
          onChange={handleDateChange}
          accentColor={THEME.COLORS.PRIMARY as string}
          locale="pt-BR"
        />
      )}
      <Feather
        name="calendar"
        size={24}
        color={THEME.COLORS.SECONDARY}
        style={styles.calendarIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  calendarIcon: {
    marginLeft: THEME.SPACING.MARGIN.HORIZONTAL,
  },
  datePickerButton: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    borderRadius: THEME.BORDER.RADIUS.BUTTON,
    flexDirection: 'row',
    marginVertical: THEME.SPACING.MARGIN.VERTICAL,
    padding: THEME.SPACING.PADDING.VERTICAL,
  },
  dateText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.NORMAL,
    marginRight: THEME.SPACING.MARGIN.HORIZONTAL,
  },
});
