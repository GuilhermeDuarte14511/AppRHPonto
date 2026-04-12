import { createElement, type ComponentType } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type AppIconName = string;

const IconComponent = Ionicons as unknown as ComponentType<{
  name: AppIconName;
  size?: number;
  color: string;
}>;

export const AppIcon = ({
  name,
  size = 20,
  color,
}: {
  name: AppIconName;
  size?: number;
  color: string;
}) =>
  createElement(IconComponent, {
    name,
    size,
    color,
  });
