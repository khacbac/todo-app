/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-empty-pattern */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "~/theme"
import { useSafeAreaInsetsStyle } from "~/utils/useSafeAreaInsetsStyle"
import { Button, ButtonProps } from "../Button"
import { Icon, IconProps } from "../Icon"
import { BaseModal } from "./BaseModal"

export type ActionType = {
  iconProps?: IconProps
  buttonProps: ButtonProps
}
type OptionType = { actions: ActionType[] }
type IProps = {}

type ActionRefType = {
  resolve?: (index: number) => void
  selectedIndex?: number
}

export type AppActionSheetType = {
  show: (options: OptionType) => Promise<number>
}

export const AppActionSheet = forwardRef<AppActionSheetType, IProps>(function AppActionSheet(
  {},
  ref,
) {
  const $safeAreaInset = useSafeAreaInsetsStyle(["bottom"])
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<OptionType>()
  const actionRef = useRef<ActionRefType>({})

  const cancelIndex = useMemo(() => options?.actions?.length || 0, [options])

  useImperativeHandle(ref, () => ({
    show(opts) {
      setVisible(true)
      setOptions(opts)
      actionRef.current.selectedIndex = undefined
      return new Promise((resolve) => {
        actionRef.current.resolve = resolve
      })
    },
  }))

  const dismissIndex = useCallback(
    (index: number) => () => {
      setVisible(false)
      actionRef.current.selectedIndex = index
    },
    [],
  )

  const onModalHide = () => {
    const { selectedIndex, resolve } = actionRef.current
    resolve?.(selectedIndex || 0)
    actionRef.current.selectedIndex = undefined
  }

  return (
    <BaseModal
      isVisible={visible}
      style={$container}
      onBackdropPress={dismissIndex(cancelIndex)}
      onModalHide={onModalHide}
    >
      <View style={[$wrapper, $safeAreaInset]}>
        <View style={$content}>
          <View style={$actionsWrapper}>
            {options?.actions?.map((act, index) => {
              const { textStyle, preset, style, ...buttonProps } = act.buttonProps || {}
              const { color, icon, size, ...iconProps } = act.iconProps || {}
              return (
                <View key={String(index)}>
                  {index > 0 && <View style={$indicator} />}
                  <Button
                    style={[$actionButton, style]}
                    preset={preset || "free"}
                    textStyle={[$actionText, textStyle]}
                    onPress={dismissIndex(index)}
                    {...(icon && {
                      LeftAccessory: () => (
                        <Icon
                          color={color || colors.white100}
                          icon={icon}
                          style={$leftIcon}
                          size={size || 24}
                          {...iconProps}
                        />
                      ),
                    })}
                    {...buttonProps}
                  />
                </View>
              )
            })}
          </View>
          <Button text="Cancel" style={$cancelButton} onPress={dismissIndex(cancelIndex)} />
        </View>
      </View>
    </BaseModal>
  )
})

const $container: ViewStyle = {
  justifyContent: "flex-end",
}

const $wrapper: ViewStyle = {}

const $content: ViewStyle = {
  paddingBottom: spacing.extraSmall,
  paddingHorizontal: 20,
}

const $actionsWrapper: ViewStyle = {
  borderRadius: 16,
  overflow: "hidden",
}

const $cancelButton: ViewStyle = {
  marginTop: 18,
  borderRadius: 16,
}

const $actionButton: ViewStyle = {
  backgroundColor: colors.warmGray600,
  paddingHorizontal: spacing.small,
  paddingVertical: spacing.medium,
  width: "100%",
  borderRadius: 0,
  justifyContent: "flex-start",
  alignItems: "center",
}

const $actionText: TextStyle = {
  color: colors.white100,
  fontFamily: typography.primary.semiBold,
}

const $indicator: ViewStyle = {
  height: 1,
  backgroundColor: colors.separator,
}

const $leftIcon: ImageStyle = { marginRight: spacing.extraSmall }
