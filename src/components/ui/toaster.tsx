import { useToaster, toast as hotToast, ToastOptions } from 'react-hot-toast/headless';
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ImageToastProps {
  /**
   * 位置，默认右上角
   */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
    | 'center';
  /**
   * 间距，默认8px
   */
  gutter?: number;
  /**
   * 是否反转顺序，默认false
   */
  reverseOrder?: boolean;
  /**
   * 图标大小
   */
  iconSize?: number;
  /**
   * 成功提示图标颜色
   */
  successColor?: string;
  /**
   * 错误提示图标颜色
   */
  errorColor?: string;
  /**
   * 加载中提示图标颜色
   */
  loadingColor?: string;
  /**
   * 默认提示图标颜色
   */
  defaultColor?: string;
  /**
   * 主题模式，默认为auto（跟随系统）
   */
  theme?: 'light' | 'dark' | 'auto';
  /**
   * 提示框宽度
   */
  width?: number | string;
  /**
   * 边框粗细
   */
  borderWidth?: number;
  /**
   * 边框圆角
   */
  borderRadius?: number;
  /**
   * 额外的类名
   */
  className?: string;
}

// 定义Toast类型
type ToastType = 'success' | 'error' | 'loading' | 'default';

// 创建四种不同类型的toast ID前缀
const TYPE_PREFIXES = {
  success: 'success-',
  error: 'error-',
  loading: 'loading-',
  default: 'default-',
};

// 默认颜色 - 边框颜色
const defaultBorderColors = {
  success: '#4ade80', // 亮绿色
  error: '#f87171', // 亮红色
  loading: '#60a5fa', // 亮蓝色
  default: '#9ca3af', // 亮灰色
};

// 默认颜色 - 背景颜色（较暗）
const defaultBgColors = {
  success: '#dcfce7', // 淡绿色
  error: '#fee2e2', // 淡红色
  loading: '#dbeafe', // 淡蓝色
  default: '#f3f4f6', // 淡灰色
};

// 默认颜色 - 暗色模式下的背景颜色
const darkBgColors = {
  success: '#065f46', // 深绿色
  error: '#7f1d1d', // 深红色
  loading: '#1e3a8a', // 深蓝色
  default: '#374151', // 深灰色
};

export function ImageToaster({
  position = 'top-right',
  gutter = 8,
  reverseOrder = false,
  iconSize = 18,
  successColor = defaultBorderColors.success,
  errorColor = defaultBorderColors.error,
  loadingColor = defaultBorderColors.loading,
  defaultColor = defaultBorderColors.default,
  theme = 'auto',
  width = 320,
  borderWidth = 1,
  borderRadius = 10,
  className,
}: ImageToastProps) {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // 检测系统主题
  useEffect(() => {
    if (theme !== 'auto') {
      setCurrentTheme(theme);
      return;
    }

    // 检测系统主题
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setCurrentTheme(e.matches ? 'dark' : 'light');
    };

    // 设置初始主题
    setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');

    // 监听主题变化
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { top: 20, right: 20 };
      case 'top-left':
        return { top: 20, left: 20 };
      case 'bottom-right':
        return { bottom: 20, right: 20 };
      case 'bottom-left':
        return { bottom: 20, left: 20 };
      case 'top-center':
        return { top: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-center':
        return { bottom: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        return { top: 20, right: 20 };
    }
  };

  // 从ID中解析类型
  const getToastTypeFromId = (id: string): ToastType => {
    if (id.startsWith(TYPE_PREFIXES.success)) return 'success';
    if (id.startsWith(TYPE_PREFIXES.error)) return 'error';
    if (id.startsWith(TYPE_PREFIXES.loading)) return 'loading';
    return 'default';
  };

  // 获取对应类型的图标和颜色
  const getIconAndColors = (type: ToastType) => {
    const isDark = currentTheme === 'dark';
    let Icon, borderColor, bgColor, iconColor;

    switch (type) {
      case 'success':
        Icon = CheckCircle;
        borderColor = successColor;
        bgColor = isDark ? darkBgColors.success : defaultBgColors.success;
        iconColor = successColor;
        break;
      case 'error':
        Icon = XCircle;
        borderColor = errorColor;
        bgColor = isDark ? darkBgColors.error : defaultBgColors.error;
        iconColor = errorColor;
        break;
      case 'loading':
        Icon = Loader2;
        borderColor = loadingColor;
        bgColor = isDark ? darkBgColors.loading : defaultBgColors.loading;
        iconColor = loadingColor;
        break;
      default:
        Icon = AlertCircle;
        borderColor = defaultColor;
        bgColor = isDark ? darkBgColors.default : defaultBgColors.default;
        iconColor = defaultColor;
        break;
    }

    return { Icon, borderColor, bgColor, iconColor };
  };

  // 获取文本颜色
  const getTextColor = (type: ToastType, isDark: boolean): string => {
    // 使用与图标颜色相同的颜色系统，但调整一下深度以增强可读性
    if (isDark) {
      // 暗色模式下，使用亮一些的颜色
      switch (type) {
        case 'success':
          return '#ecfdf5'; // 亮绿色文本
        case 'error':
          return '#fef2f2'; // 亮红色文本
        case 'loading':
          return '#eff6ff'; // 亮蓝色文本
        default:
          return '#f9fafb'; // 亮灰色文本
      }
    } else {
      // 亮色模式下，使用深一些的颜色
      switch (type) {
        case 'success':
          return '#065f46'; // 深绿色文本
        case 'error':
          return '#991b1b'; // 深红色文本
        case 'loading':
          return '#1e40af'; // 深蓝色文本
        default:
          return '#1f2937'; // 深灰色文本
      }
    }
  };

  // 获取transform属性
  const getTransform = (offset: number) => {
    if (position === 'center') {
      return 'translate(-50%, -50%)';
    } else if (position.includes('center')) {
      return `translateX(-50%) translateY(${offset}px)`;
    } else if (position.includes('bottom')) {
      return `translateY(-${offset}px)`;
    }
    return `translateY(${offset}px)`;
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        position.includes('center')
          ? 'items-center'
          : position.includes('right')
            ? 'items-end'
            : 'items-start',
        className
      )}
      style={{
        position: 'fixed',
        zIndex: 9999,
        width: 'auto', // 移除固定宽度限制
        maxWidth: '100%',
        ...getPositionStyle(),
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder,
          gutter,
        });

        const ref = (el: HTMLDivElement | null) => {
          if (el && typeof toast.height !== 'number') {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };

        // 根据ID确定类型
        const type = getToastTypeFromId(toast.id);
        const { Icon, borderColor, bgColor, iconColor } = getIconAndColors(type);
        const isLoading = type === 'loading';
        const isDark = currentTheme === 'dark';
        const textColor = getTextColor(type, isDark);

        return (
          <div
            key={toast.id}
            ref={ref}
            style={{
              position: 'absolute',
              width: typeof width === 'number' ? `${width}px` : width,
              backgroundColor: bgColor,
              color: textColor,
              borderRadius: `${borderRadius}px`,
              border: `${borderWidth}px solid ${borderColor}`,
              padding: '10px 14px',
              transition: 'all 0.3s ease-out',
              opacity: toast.visible ? 1 : 0,
              transform: getTransform(offset),
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxSizing: 'border-box',
              fontSize: '14px',
              lineHeight: '1.2',
              maxHeight: `${iconSize + 20}px`, // 确保单行显示
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
              fontWeight: 500,
              left: 0, // 确保定位正确
              right: 0, // 确保在center模式下居中
              margin: position === 'center' ? 'auto' : 'unset', // 居中添加
            }}
            {...toast.ariaProps}
          >
            <Icon
              color={iconColor}
              size={iconSize}
              className={isLoading ? 'animate-spin' : ''}
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {typeof toast.message === 'function' ? '通知' : toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// 创建唯一ID
const generateId = (prefix: string): string => {
  return `${prefix}${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// 创建消息类型
type ToastMessage = string | React.ReactNode;

export const imageToast = {
  success: (message: ToastMessage, duration = 3000) =>
    hotToast(String(message), {
      duration,
      id: generateId(TYPE_PREFIXES.success),
    }),
  error: (message: ToastMessage, duration = 3000) =>
    hotToast(String(message), {
      duration,
      id: generateId(TYPE_PREFIXES.error),
    }),
  loading: (message: ToastMessage, duration = 3000) =>
    hotToast(String(message), {
      duration,
      id: generateId(TYPE_PREFIXES.loading),
    }),
  default: (message: ToastMessage, duration = 3000) =>
    hotToast(String(message), {
      duration,
      id: generateId(TYPE_PREFIXES.default),
    }),
  custom: (message: ToastMessage, options: Partial<ToastOptions> = {}) =>
    hotToast(String(message), options),
  dismiss: hotToast.dismiss,
};

export { hotToast as toast };
export default imageToast;
