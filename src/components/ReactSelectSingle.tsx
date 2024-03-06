import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { forwardRef } from 'react';
  import { Controller } from 'react-hook-form';
  import ReactSelect from 'react-select';
  type Props = {
    name: string;
    label: string;
    error: any;
    defaultValue: any;
    isDisabled?: boolean;
    control: any;
    helperText?: any;
    object: any;
    zIndex?: any;
  };
  const SelectBase = (
    {
      name,
      label,
      error = null,
      isDisabled = false,
      defaultValue = null,
      control,
      helperText = null,
      object = null,
      zIndex = 1,
      ...rest
    }: Props,
    ref: any
  ) => {
    const bg = useColorModeValue('gray.100', 'gray.700');
    return (
      <FormControl isInvalid={true} zIndex={zIndex}>
        {!!label && (
          <FormLabel variant="inline" htmlFor={name}>
            {label}
          </FormLabel>
        )}
        <Controller
          control={control}
          defaultValue={{value: defaultValue?.situation}}
          name={name}
          render={({ field: { onChange, value, ref } }) => (
            <ReactSelect
              placeholder="-- Selecione --"
              id={name}
              instanceId={name}
              ref={ref}
              isDisabled={isDisabled}
              {...rest}
              value={object
                ?.map((p: any) => ({
                  value: p.value,
                  label: p.name,
                }))
                .find((c: any) => c.value === (value?.value || value))}
              onChange={onChange}
              options={object?.map((p: any) => ({
                value: p.value,
                label: p.name,
                backgroundColor: '#333',
              }))}
            />
          )}
        />
        {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
        {!!error && <FormErrorMessage>{error.value?.message}</FormErrorMessage>}
      </FormControl>
    );
  };
  
  export const ReactSelectSingle = forwardRef(SelectBase);