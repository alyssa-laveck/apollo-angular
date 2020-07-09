import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  loading = false;
  userTotal: number;
  users: any;

  feed: any;

  private subscriptions: Subscription[];

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.getSwPeople();
    this.getHackerNewsData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub && sub.unsubscribe());
  }

  getSwPeople(): void {
    this.apollo.watchQuery<any>({
      query: gql`
        query peopleQuery($queryParams: String) {
          people(queryParams: $queryParams) @rest(type: "PeoplePayload", path: "people{args.queryParams}") {
            count
            results @type(name: "PeopleResults") {
              name
            }
          }
        }
      `,
      variables: {
        queryParams: '?search=luke'
      }
    })
      .valueChanges
      .subscribe({
        next: (res) => {
          this.loading = res.loading;
          this.userTotal = res.data.people.count;
          this.users = res.data.people.results;
        }
      });
  }

  getHackerNewsData(): void {
    const query = gql`
      query getFeed {
        feed {
          count
          links {
            id
            description
            url
          }
        }
      }
    `;

    this.apollo.watchQuery<any>({ query })
      .valueChanges
      .subscribe({
        next: ({ data }) => {
          this.feed = data.feed;
        }
      });
  }
}
