// ---Dependencies
import React, { useEffect, useState } from 'react';
// ---Styles
import style from './CollapseReusable.module.scss';
import { Collapse } from 'antd';
import { CollapseProps } from 'antd/lib';
import { HeadLabel } from './HeadLabel/HeadLabel';

interface Props<T extends Record<string, unknown>[]> {
  /** Se necesita array de objetos con algún id */
  data: T;
  selectionCtrl?: CollapseSelectionProps;
  // HeadComponent: React.FC<{ record: T[number] }>;
  HeadComponent: React.FC<any>;
  BodyComponent?: React.FC<any>;
  bodyProps?: any;
  headProps?: any;
  hide?: boolean;
  justHead?: boolean;
  collapseProps?: CollapseProps;
}

/**
 * CollapseReusable Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function CollapseReusable<T extends any[]>({
  data,
  selectionCtrl,
  HeadComponent,
  BodyComponent,
  bodyProps,
  headProps,
  hide = false,
  justHead = false,
  collapseProps,
}: Props<T>) {
  // -----------------------CONSTS, HOOKS, STATES
  const getBody = !!BodyComponent
    ? (record: any) => <BodyComponent {...bodyProps} record={record} />
    : () => null;

  const doSelectAll = selectionCtrl?.selectAllCtrl.doSelectAll;
  const items: CollapseProps['items'] = data.map((record, index) => ({
    key: `collapsable-card-${record?.id || index}`,
    label: (
      <HeadLabel
        justHead={justHead}
        record={record}
        selectionCtrl={selectionCtrl}
        trueLabel={<HeadComponent record={record} index={index} length={data.length} {...headProps} />}
      />
    ),
    children: getBody(record),
  }));

  // Ignoramos dependencias adicionales (data) porque no nos interesa re-trigger si cambia algo maś
  // de lo que afecta al collapse, sólo nos interesa el momento en que la flag es true
  useEffect(() => {
    if (doSelectAll && selectionCtrl) {
      const { selectAllCtrl, setSelectedKeys, key } = selectionCtrl;
      setSelectedKeys(data.map((record) => record[key!]));
      selectAllCtrl?.setDoSelectAll(false); // reset flag
    }
  }, [doSelectAll]);
  // -----------------------MAIN METHODS
  // -----------------------HELPERS
  // -----------------------RENDER
  if (hide) return null;
  return (
    <div className={style['CollapseReusable']}>
      <Collapse
        bordered={false}
        accordion
        expandIconPosition='end'
        items={items}
        expandIcon={justHead ? () => null : undefined}
        {...collapseProps}
      />
    </div>
  );
}

export function useCollapseSelection(key = 'id') {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [doSelectAll, setDoSelectAll] = useState(false);

  return {
    selectedKeys,
    setSelectedKeys,
    clearAll: () => setSelectedKeys([]),
    selectAllCtrl: {
      doSelectAll,
      setDoSelectAll,
    },
    selectAll: () => setDoSelectAll(true),
    key,
  };
}

export type CollapseSelectionProps = ReturnType<typeof useCollapseSelection>;
