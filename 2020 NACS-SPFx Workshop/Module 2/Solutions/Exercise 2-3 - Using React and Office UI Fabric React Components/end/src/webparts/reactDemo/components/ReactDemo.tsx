import * as React from 'react';
import styles from './ReactDemo.module.scss';
import { IReactDemoProps } from './IReactDemoProps';
import { IReactDemoState } from './IReactDemoState';
import { escape } from '@microsoft/sp-lodash-subset';

import { IColor } from './IColor';
import { ColorList, IColorListProps } from './ColorList';
import { render } from 'react-dom';

export default class ReactDemo extends React.Component<IReactDemoProps, IReactDemoState> {
    private _colors: IColor[] = [
        { id: 1, title: 'red' },
        { id: 2, title: 'white' },
        { id: 3, title: 'blue' }
    ];

    constructor(props: IReactDemoProps) {
        super(props);
        this.state = { colors: [] };
    }

    public componentDidMount(): void {
        this.getSpColors()
            .then((spColors: IColor[]) => {
                this.setState({ colors: spColors });
            });
    }

    private getSpColors(): Promise<IColor[]> {
        return new Promise<IColor[]>((resolve, reject) => {
            resolve(this._colors);
        });
    }

    public render(): React.ReactElement<IReactDemoProps> {
        return (
            <div className={styles.reactDemo} >
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <span className={styles.title}>Welcome to SharePoint!</span>
                            <ColorList colors={this.state.colors} onRemoveColor={this._removeColor} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private _removeColor = (colorToRemove: IColor): void => {
        const newColors: IColor[] = this.state.colors.filter(color => color != colorToRemove);
        this.setState({ colors: newColors });
    }
}
