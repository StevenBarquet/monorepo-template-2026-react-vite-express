// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './ClickableTooltip.module.scss';
import { Button, Tooltip } from 'antd';
import { Icon } from '@iconify/react';

interface Props {
  content?: string | React.ReactNode;
}

/**
 * ClickableTooltip Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ClickableTooltip({ content: tooltipContent }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const [visible, setVisible] = useState(false);
  // -----------------------MAIN METHODS
  const showTooltip = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 1200 * 1000); // Oculta el tooltip después de 5 segundos
  };

  function handleClickOutside() {
    if (visible) setVisible(false);
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <span className={style['ClickableTooltip']}>
      {tooltipContent && tooltipContent !== '' ? (
        <>
          {visible && <button className='tooltipClose' onClick={handleClickOutside} />}
          <Tooltip title={tooltipContent} open={visible}>
            <Button onClick={showTooltip} type='text'>
              <Icon icon='ri:question-line' />
            </Button>
          </Tooltip>
        </>
      ) : null}
    </span>
  );
}
