//
//  QC_Base_ExampleAppDelegate.m
//  QC Base Example
//
//  Created by Lee Barney on 3/28/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "QC_Base_ExampleAppDelegate.h"
#import "QuickConnect.h"
#import "checkNameValCO.h"
#import "AddUserBCO.h"
#import "ShowSuccessVCO.h"
#import "GetUsersBCO.h"
#import "ListUsersVCO.h"
#import "UrlCheckValCO.h"
#import "GetRequestBCO.h"
#import "DisplayHtmlVCO.h"
#import "GenericECO.h"
#import "MissingValueECO.h"

@implementation QC_Base_ExampleAppDelegate


@synthesize window=_window;

@synthesize managedObjectContext=__managedObjectContext;

@synthesize managedObjectModel=__managedObjectModel;

@synthesize persistentStoreCoordinator=__persistentStoreCoordinator;


//Example specific attributes
@synthesize aQuickConnect;
@synthesize resultView;
@synthesize nameInput;
@synthesize urlInput;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    /* Setup the QuickConnect class to use a persistent store 
     * since we are using Core Data.
     */
    aQuickConnect = [[QuickConnect alloc] initWithPersistentStoreCoodinator:self.persistentStoreCoordinator];
    
    
    //Map your commands to your handlers here.  This is done only once.
    
    /*
     * control stack for inserting a user
     */
    
    [aQuickConnect mapCommandToValCO:@"add" withObject:[CheckNameValCO class]];
	[aQuickConnect mapCommandToBCO:@"add" withObject:[AddUserBCO class]];
	[aQuickConnect mapCommandToVCO:@"add" withObject:[ShowSuccessVCO class]];
    
    /*
     * control stack for displaying all user information
     */
	[aQuickConnect mapCommandToBCO:@"query" withObject:[GetUsersBCO class]];
	[aQuickConnect mapCommandToVCO:@"query" withObject:[ListUsersVCO class]];
    
    
    /*
     * control stack for executing HTTP GET
     */
    
    [aQuickConnect mapCommandToValCO:@"requestHtml" withObject:[UrlCheckValCO class]];
	[aQuickConnect mapCommandToBCO:@"requestHtml" withObject:[GetRequestBCO class]];
	[aQuickConnect mapCommandToVCO:@"requestHtml" withObject:[DisplayHtmlVCO class]];
    
    
	/*
	 *  Error handling for an empty text field.
	 *  Any number of ECO's can be mapped.
	 */
	[aQuickConnect mapCommandToECO:@"missingValue" withObject:[MissingValueECO class]];
    
    
	/*
	 *  Error handling for multiple types of errors
	 */
	[aQuickConnect mapCommandToECO:@"genericError" withObject:[GenericECO class]];

    [self.window makeKeyAndVisible];
    return YES;
}

/*
 *  Example specific IBActions
 */

-(void) doInsert: (id) sender{
    NSMutableDictionary *paramsDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.nameInput.text, @"name", self.resultView, @"resultDisplay", nil];
    [aQuickConnect handleRequest:@"add" withParameters:paramsDictionary];
}
-(void) doQuery: (id) sender{
    NSMutableDictionary *paramsDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.resultView, @"resultDisplay", nil];
    [aQuickConnect handleRequest:@"query" withParameters:paramsDictionary];
}
-(void) doHTTPRequest: (id) sender{
    NSMutableDictionary *paramsDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:self.urlInput.text, @"url", self.resultView, @"resultDisplay", nil];
    [aQuickConnect handleRequest:@"requestHtml" withParameters:paramsDictionary];
}


- (void)applicationWillResignActive:(UIApplication *)application
{
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
     If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
     */
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    /*
     Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
     */
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Saves changes in the application's managed object context before the application terminates.
    [self saveContext];
}

- (void)dealloc
{
    [_window release];
    [__managedObjectContext release];
    [__managedObjectModel release];
    [__persistentStoreCoordinator release];
    [super dealloc];
}

- (void)awakeFromNib
{
    /*
     Typically you should set up the Core Data stack here, usually by passing the managed object context to the first view controller.
     self.<#View controller#>.managedObjectContext = self.managedObjectContext;
    */
}

- (void)saveContext
{
    NSError *error = nil;
    NSManagedObjectContext *managedObjectContext = self.managedObjectContext;
    if (managedObjectContext != nil)
    {
        if ([managedObjectContext hasChanges] && ![managedObjectContext save:&error])
        {
            /*
             Replace this implementation with code to handle the error appropriately.
             
             abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development. If it is not possible to recover from the error, display an alert panel that instructs the user to quit the application by pressing the Home button.
             */
            NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
            abort();
        } 
    }
}

#pragma mark - Core Data stack

/**
 Returns the managed object context for the application.
 If the context doesn't already exist, it is created and bound to the persistent store coordinator for the application.
 */
- (NSManagedObjectContext *)managedObjectContext
{
    if (__managedObjectContext != nil)
    {
        return __managedObjectContext;
    }
    
    NSPersistentStoreCoordinator *coordinator = [self persistentStoreCoordinator];
    if (coordinator != nil)
    {
        __managedObjectContext = [[NSManagedObjectContext alloc] init];
        [__managedObjectContext setPersistentStoreCoordinator:coordinator];
    }
    return __managedObjectContext;
}

/**
 Returns the managed object model for the application.
 If the model doesn't already exist, it is created from the application's model.
 */
- (NSManagedObjectModel *)managedObjectModel
{
    if (__managedObjectModel != nil)
    {
        return __managedObjectModel;
    }
    NSURL *modelURL = [[NSBundle mainBundle] URLForResource:@"QC_Base_Example" withExtension:@"momd"];
    __managedObjectModel = [[NSManagedObjectModel alloc] initWithContentsOfURL:modelURL];    
    return __managedObjectModel;
}

/**
 Returns the persistent store coordinator for the application.
 If the coordinator doesn't already exist, it is created and the application's store added to it.
 */
- (NSPersistentStoreCoordinator *)persistentStoreCoordinator
{
    if (__persistentStoreCoordinator != nil)
    {
        return __persistentStoreCoordinator;
    }
    
    NSURL *storeURL = [[self applicationDocumentsDirectory] URLByAppendingPathComponent:@"QC_Base_Example.sqlite"];
    
    NSError *error = nil;
    __persistentStoreCoordinator = [[NSPersistentStoreCoordinator alloc] initWithManagedObjectModel:[self managedObjectModel]];
    if (![__persistentStoreCoordinator addPersistentStoreWithType:NSSQLiteStoreType configuration:nil URL:storeURL options:nil error:&error])
    {
        /*
         Replace this implementation with code to handle the error appropriately.
         
         abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development. If it is not possible to recover from the error, display an alert panel that instructs the user to quit the application by pressing the Home button.
         
         Typical reasons for an error here include:
         * The persistent store is not accessible;
         * The schema for the persistent store is incompatible with current managed object model.
         Check the error message to determine what the actual problem was.
         
         
         If the persistent store is not accessible, there is typically something wrong with the file path. Often, a file URL is pointing into the application's resources directory instead of a writeable directory.
         
         If you encounter schema incompatibility errors during development, you can reduce their frequency by:
         * Simply deleting the existing store:
         [[NSFileManager defaultManager] removeItemAtURL:storeURL error:nil]
         
         * Performing automatic lightweight migration by passing the following dictionary as the options parameter: 
         [NSDictionary dictionaryWithObjectsAndKeys:[NSNumber numberWithBool:YES], NSMigratePersistentStoresAutomaticallyOption, [NSNumber numberWithBool:YES], NSInferMappingModelAutomaticallyOption, nil];
         
         Lightweight migration will only work for a limited set of schema changes; consult "Core Data Model Versioning and Data Migration Programming Guide" for details.
         
         */
        NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
        abort();
    }    
    
    return __persistentStoreCoordinator;
}

#pragma mark - Application's Documents directory

/**
 Returns the URL to the application's Documents directory.
 */
- (NSURL *)applicationDocumentsDirectory
{
    return [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
}

@end
