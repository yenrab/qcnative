//
//  QC_Base_ExampleAppDelegate.h
//  QC Base Example
//
//  Created by Lee Barney on 3/28/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
@class QuickConnect;

@interface QC_Base_ExampleAppDelegate : NSObject <UIApplicationDelegate> {
    QuickConnect *aQuickConnect;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;

@property (nonatomic, retain, readonly) NSManagedObjectContext *managedObjectContext;
@property (nonatomic, retain, readonly) NSManagedObjectModel *managedObjectModel;
@property (nonatomic, retain, readonly) NSPersistentStoreCoordinator *persistentStoreCoordinator;


//Example specific IBOutlets
@property (nonatomic, retain) IBOutlet UITextView *resultView;
@property (nonatomic, retain) IBOutlet UITextField *nameInput;
@property (nonatomic, retain) IBOutlet UITextField *urlInput;

//Add this property declaration to use QC
@property (nonatomic, retain) QuickConnect *aQuickConnect;

- (void)saveContext;
- (NSURL *)applicationDocumentsDirectory;

//Example specific IBActions

-(IBAction) doInsert: (id) sender;
-(IBAction) doQuery: (id) sender;
-(IBAction) doHTTPRequest: (id) sender;

//standard methods
- (void)saveContext;
- (NSURL *)applicationDocumentsDirectory;

@end
