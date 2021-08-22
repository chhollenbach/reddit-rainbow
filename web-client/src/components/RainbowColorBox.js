function RainbowColorBox(props) {
    const colorWords = {}
    const divStyle = {backgroundColor: props.color}

    // Set colors in other languages because I don't want to pay for an API
    if (props.color === 'Red'){
        colorWords.english = 'Red'
        colorWords.spanish = 'Rojo'
        colorWords.mandarin = '紅色'
        colorWords.hindi = 'लाल'
        colorWords.russian = 'красный'
        divStyle.color = 'White'
    }
    else if (props.color === 'Orange'){
        colorWords.english = 'Orange'
        colorWords.spanish = 'Naranja'
        colorWords.mandarin = '橙色的'
        colorWords.hindi = 'संतरा'
        colorWords.russian = 'апельсин'
        divStyle.color = 'White'
    }
    else if (props.color === 'Yellow'){
        colorWords.english = 'Yellow'
        colorWords.spanish = 'Amarillo'
        colorWords.mandarin = '黄色'
        colorWords.hindi = 'पीला'
        colorWords.russian = 'Желтый'
        divStyle.color = 'Black'
    }
    else if (props.color === 'Green'){
        colorWords.english = 'Green'
        colorWords.spanish = 'Verde'
        colorWords.mandarin = '绿色的'
        colorWords.hindi = 'हरा'
        colorWords.russian = 'Зеленый'
        divStyle.color = 'White'
    }
    else if (props.color === 'Blue'){
        colorWords.english = 'Blue'
        colorWords.spanish = 'Azul'
        colorWords.mandarin = '蓝色的'
        colorWords.hindi = 'नीला'
        colorWords.russian = 'Синий'
        divStyle.color = 'White'
    }
    else if (props.color === 'Indigo'){
        colorWords.english = 'Indigo'
        colorWords.spanish = 'Indiga'
        colorWords.mandarin = '靛青'
        colorWords.hindi = 'नील'
        colorWords.russian = 'Индиго'
        divStyle.color = 'White'
    }
    else if (props.color === 'Violet'){
        colorWords.english = 'Violet'
        colorWords.spanish = 'Violeta'
        colorWords.mandarin = '紫色'
        colorWords.hindi = 'बैंगनी'
        colorWords.russian = 'фиолетовый'
        divStyle.backgroundColor = 'darkviolet'
        divStyle.color = 'White'
    }

    function toggleInfoPanel(col) {
       props.onClick(col)
      }

    return(
            <div className="column Color-column" style={divStyle} onClick={() => toggleInfoPanel(props.color)}>
                <div className="column">
                    {colorWords.english}
                </div>
                <div className="column">
                    {colorWords.spanish}
                </div>
                <div className="column">
                    {colorWords.mandarin}
                </div>
                <div className="column">
                    {colorWords.hindi}
                </div>
                <div className="column">
                    {colorWords.russian}
                </div>
            </div>
    )
}

export default RainbowColorBox