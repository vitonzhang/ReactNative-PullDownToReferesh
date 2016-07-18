/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PropTypes,
} = require('react-native');

/*
var { 
  GiftedSpinner, 
} = require('./components/react-native-gifted-spinner/GiftedSpinner.js');
*/

var GiftedListView = require('./components/react-native-gifted-listview-0.0.12/GiftedListView.js');

var { 
  KLWaitingType, 
  KLWillRefreshType, 
  KLRefreshView,
  KLFetchingView,
  KLSpinner,
} = require('./animation/animation_rotation.js');


var Example = React.createClass({

  getInitialState() {
    return { 
      lastRefreshDate: '',
      waitingTitle: '下拉可以刷新',
      willRefreshTitle: '松开即可刷新',
      fetchingTitle: '正在加载, 请稍后',
    };
  },

  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    setTimeout(() => {
      var header = 'Header '+page;
      var rows = {};
      rows[header] = ['row '+((page - 1) * 3 + 1), 'row '+((page - 1) * 3 + 2), 'row '+((page - 1) * 3 + 3)];
      
      // After fetch the data, we set the last refresh date.
      if (page === 1) {
        var now = new Date();
        var mm = now.getMonth()+1;
        var dd = now.getDay()+1;
        var hh = now.getHours();
        var mins = now.getMinutes();
        this.setState(
            { lastRefreshDate: `最近更新时间: ${mm}月${dd}日 ${hh}:${mins}`}
          );
      }

      if (page === 5) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });
      } else {
        callback(rows);
      }
    }, 1000); // simulating network fetching
  },


  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    console.log(rowData+' pressed');
  },

  /**
   * Render a row
   * @param {object} rowData Row data
   */
  _renderRowView(rowData) {
    return (
      <TouchableHighlight
        style={customStyles.row}
        underlayColor='#c8c7cc'
        onPress={() => this._onPress(rowData)}
      >
        <Text>{rowData}</Text>
      </TouchableHighlight>
    );
  },

  /**
   * Render a row
   * @param {object} rowData Row data
   */
  _renderSectionHeaderView(sectionData, sectionID) {
    return (
      <View style={customStyles.header}>
        <Text style={customStyles.headerTitle}>
          {sectionID}
        </Text>
      </View>
    );
  },

  /**
   * Render the refreshable view when waiting for refresh
   * On Android, the view should be touchable to trigger the refreshCallback
   * @param {function} refreshCallback The function to call to refresh the listview
   */
  _renderRefreshableWaitingView(refreshCallback, prevRefreshStatus) {
    if (Platform.OS !== 'android') {

      // console.log(`[WaitingView] prevRefreshStatus: ${prevRefreshStatus} !`);

      let rotateArrow = false;
      if (prevRefreshStatus === 'willRefresh') {
        rotateArrow = true;
      }

      return (
        <View style={customStyles.refreshableView}>
          <KLRefreshView title={this.state.waitingTitle} 
                          detail={this.state.lastRefreshDate} 
                          type={KLWaitingType} 
                          rotateArrow={rotateArrow}>
          </KLRefreshView>
        </View>
      );

      /*
      return (
        <View style={customStyles.refreshableView}>
          <Text style={customStyles.actionsLabel}>
            ↓
          </Text>
        </View>
      );
      */
    } else {
      return (
        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
          style={customStyles.refreshableView}
        >
          <Text style={customStyles.actionsLabel}>
            ↻
          </Text>
        </TouchableHighlight>
      );
    }
  },

  /**
   * Render the refreshable view when the pull to refresh has been activated
   * @platform ios
   */
  _renderRefreshableWillRefreshView(prevRefreshStatus) {
    /*
    return (
      <View style={customStyles.refreshableView}>
        <Text style={customStyles.actionsLabel}>
          ↻
        </Text>
      </View>
    );
    */
  
    // console.log(`[WillRefreshView] prevRefreshStatus: ${prevRefreshStatus} !`);

    let rotateArrow = false;
    if (prevRefreshStatus === 'waiting') {
      rotateArrow = true;
    }

    return (
      <View style={customStyles.refreshableView}>
        <KLRefreshView title={this.state.willRefreshTitle} 
                          detail={this.state.lastRefreshDate} 
                          type={KLWillRefreshType}
                          rotateArrow={rotateArrow}>
        </KLRefreshView>
      </View>
      );
  },

  /**
   * Render the refreshable view when fetching
   */
  _renderRefreshableFetchingView() {
    
    /*
    return (
      <View style={customStyles.refreshableView}>
        <GiftedSpinner />
      </View>
    );
    */
    return (
      <View style={customStyles.refreshableView}>
        <KLFetchingView title={this.state.fetchingTitle}>
        </KLFetchingView>
      </View>
    );
  },

  /**
   * Render the pagination view when waiting for touch
   * @param {function} paginateCallback The function to call to load more rows
   */
  _renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor='#c8c7cc'
        onPress={paginateCallback}
        style={customStyles.paginationView}
      >
        <Text style={[customStyles.actionsLabel, {fontSize: 13}]}>
          Load more
        </Text>
      </TouchableHighlight>
    );
  },

  /**
   * Render the pagination view when fetching
   */
  _renderPaginationFetchingView() {
    
    return (
      <View style={customStyles.paginationView}>
        <KLSpinner /> 
      </View>
      );
      
    /*
    return (
      <View style={customStyles.paginationView}>
        <GiftedSpinner /> 
      </View>
      );
    */  
  },

  /**
   * Render the pagination view when end of list is reached
   */
  _renderPaginationAllLoadedView() {
    return (
      <View style={customStyles.paginationView}>
        <Text style={customStyles.actionsLabel}>
          ~
        </Text>
      </View>
    );
  },

  /**
   * Render a view when there is no row to display at the first fetch
   * @param {function} refreshCallback The function to call to refresh the listview
   */
  _renderEmptyView(refreshCallback) {
    return (
      <View style={customStyles.defaultView}>
        <Text style={customStyles.defaultViewTitle}>
          Sorry, there is no content to display
        </Text>

        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
        >
          <Text>
            ↻
          </Text>
        </TouchableHighlight>
      </View>
    );
  },

  /**
   * Render a separator between rows
   */
  _renderSeparatorView() {
    return (
      <View style={customStyles.separator} />
    );
  },

  render() {
    return (
      <View style={screenStyles.container}>
        <View style={screenStyles.navBar}>
          <Text style={screenStyles.navBarTitle}>Gifted ListView</Text>
        </View>
        <GiftedListView
          rowView={this._renderRowView}

          onFetch={this._onFetch}
          initialListSize={12} // the maximum number of rows displayable without scrolling (height of the listview / height of row)

          firstLoader={true} // display a loader for the first fetching

          pagination={true} // enable infinite scrolling using touch to load more
          paginationFetchingView={this._renderPaginationFetchingView}
          paginationAllLoadedView={this._renderPaginationAllLoadedView}
          paginationWaitingView={this._renderPaginationWaitingView}

          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          refreshableViewHeight={80} // correct height is mandatory
          refreshableDistance={60} // the distance to trigger the pull-to-refresh - better to have it lower than refreshableViewHeight
          refreshableFetchingView={this._renderRefreshableFetchingView}
          refreshableWillRefreshView={this._renderRefreshableWillRefreshView}
          refreshableWaitingView={this._renderRefreshableWaitingView}

          emptyView={this._renderEmptyView}

          renderSeparator={this._renderSeparatorView}

          withSections={true} // enable sections
          sectionHeaderView={this._renderSectionHeaderView}

          PullToRefreshViewAndroidProps={{
            colors: ['#fff'],
            progressBackgroundColor: '#003e82',
          }}

          rowHasChanged={(r1,r2)=>{
            r1.id !== r2.id
          }}
          distinctRows={(rows)=>{
            var indentitis = {};
            var newRows = [];
            for(var i = 0;i<rows.length; i++){
              if(indentitis[rows[i].id]){

              }else{
                indentitis[rows[i].id]=true;
                newRows.push(rows[i]);
              }
            }
            return newRows;
          }}
        />
      </View>
    );
  }
});


var customStyles = {
  separator: {
    height: 1,
    backgroundColor: '#CCC'
  },
  refreshableView: {
    height: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsLabel: {
    fontSize: 20,
    color: '#007aff',
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    padding: 10,
    height: 44,
  },
  header: {
    backgroundColor: '#50a4ff',
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
  },
};

var screenStyles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    height: 64,
    backgroundColor: '#007aff',

    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  }
};

module.exports = Example;
