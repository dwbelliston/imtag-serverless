# Database setup

## In AWS

Create RDS instance, this example uses AWS Aurora Serverless, which has to be placed in a VPC. This adds additional complexity because the lambdas need to then be deployed in the same vpc subnets, this is done when you setup the CloudFormation templates.

## Locally

When the apis are run locally it will require access to a local database, or if you want to tunnel into a remote database that would work too.

Find a tutorial online to help you setup mysql locally. https://dev.mysql.com/doc/mysql-getting-started/en/ If you are on a mac, I have great success with brew.

## SQL to Setup tables

### Image Table

Create the table

```sql
CREATE TABLE IF NOT EXISTS image_urls (
    image_url_id INT AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_url_id)
);
```

Insert sample data

```sql
INSERT INTO image_urls (image_url)
VALUES
('https://www.fillmurray.com/g/400/400'),
('https://www.fillmurray.com/g/500/500');
('https://images.unsplash.com/photo-1526716173434-a1b560f2065d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'),
('https://images.unsplash.com/photo-1525382455947-f319bc05fb35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1414&q=80'),
('https://images.unsplash.com/photo-1526716121440-dc3b4f254a0a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80'),
('https://images.unsplash.com/photo-1521298355169-e5c635852ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80'),
('https://images.unsplash.com/photo-1540125895252-edefe1c0132e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80'),
('https://images.unsplash.com/photo-1540126034813-121bf29033d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80');
```

### Tags table

Create tags

```sql
CREATE TABLE IF NOT EXISTS tags (
    tag_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tag_id)
);
```

```sql
INSERT INTO tags (name)
VALUES ('panda'), ('bill murray');
```

Create table to hold user tags

```sql
CREATE TABLE IF NOT EXISTS user_tags (
id INT AUTO_INCREMENT,
user_id VARCHAR(255) NOT NULL,
image_url VARCHAR(255) NOT NULL,
tag_name VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id)
);
```

```sql
INSERT INTO user_tags (user_id, image_url, tag_name)
VALUES ('1', 'image_url', 'test');
```

## Misc

Some commands that were helpful to me in connecting to local

    mysql -u root;

    GRANT ALL PRIVILEGES ON _._ TO `computer name`@`localhost`;

    mysql --user=user-name --password -h hostname
