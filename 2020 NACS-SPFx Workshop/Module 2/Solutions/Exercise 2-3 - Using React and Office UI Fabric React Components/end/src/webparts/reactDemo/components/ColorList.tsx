import * as React from 'react';
import { IColor } from './IColor';
import { List } from 'office-ui-fabric-react/lib/List';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

export type RemoveColorCallback = (color: IColor) => void;
export interface IColorListProps {
    colors: IColor[];
    onRemoveColor: RemoveColorCallback;
}

export class ColorList extends React.Component<IColorListProps, {}> {
    public render(): React.ReactElement<IColorListProps> {
        return (
            <List items={this.props.colors} onRenderCell={this._onRenderCell} />
        );
    }

    private _onRenderCell = (color: IColor): JSX.Element => {
        return (
            <div>
                { color.title}<br />
                <DefaultButton text="delete"
                    data={color.id}
                    onClick={() => this._onButtonClicked(color)}
                />
            </div>

        )
    }

    private _onButtonClicked(color: IColor): void {
        console.log('clicked delete for color', color);
        this.props.onRemoveColor(color);
    }
}
